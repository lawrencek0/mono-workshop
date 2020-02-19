use fantoccini::error::CmdError;
use fantoccini::{Client, Element, Locator};
use rusqlite::{params, Connection};
use tokio::sync::mpsc;
use tokio::task::spawn_blocking;

use crate::phagesdb_api::Phage;
use std::path::Path;
use std::sync::{Arc, Mutex};

pub struct Pet {
    pub client: Client,
    email: String,
    password: String,
}

impl Pet {
    pub async fn new(email: String, password: String) -> Self {
        let caps = r#"{
            "moz:firefoxOptions": {
                "args": ["--headless"]
            }
        }"#;

        let client =
            Client::with_capabilities("http://localhost:4444", serde_json::from_str(caps).unwrap())
                .await
                .expect("Failed to connect to webdriver");
        Pet {
            client,
            email,
            password,
        }
    }

    // @TODO: what if login fails?
    pub async fn login(&mut self) -> Result<Element, CmdError> {
        self.client
            .goto("http://phageenzymetools.com/login")
            .await?;
        let mut form = self.client.form(Locator::Css(".form-signin")).await?;
        form.set_by_name("email", &self.email).await?;
        form.set_by_name("password", &self.password).await?;
        form.submit().await?;
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await
    }

    pub async fn get_genera(&mut self) -> Result<Vec<String>, CmdError> {
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await?
            .click()
            .await?;
        self.client.wait_for_find(Locator::Css("#genera")).await?;
        let options = self
            .client
            .find_all(Locator::Css("#genera > option"))
            .await?;

        let mut genera = Vec::with_capacity(options.len());
        for mut option in options {
            let text = option
                .attr("value")
                .await?
                .expect("Genus value can't be blank");
            genera.push(text);
        }

        Ok(genera)
    }

    pub async fn open_genus(&mut self, genus: &str) -> Result<(), CmdError> {
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css(r#"input[placeholder="Search Genera"]"#))
            .await?
            .click()
            .await?
            .wait_for_find(Locator::Css(r#"input[placeholder="Search Genera"]"#))
            .await?
            .send_keys(genus)
            .await?;
        self.client
            .find(Locator::Css(&format!(r#"li[id$=-{}]"#, genus)))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css(r#"input[placeholder="Search Enzymes"]"#))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css(r#"li[id$="-AanI"]"#))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css("#submit"))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css(r#"select[name="cutTable_length"]"#))
            .await?
            .select_by_value("100")
            .await?;
        Ok(())
    }

    async fn open_modify_phage(&mut self) -> Result<Element, CmdError> {
        self.client
            .goto("http://phageenzymetools.com/modify_phage_data")
            .await?;

        self.client
            .wait_for_find(Locator::Css("a[href='#view3']"))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css("#select_modify_phage"))
            .await
    }

    pub async fn scrape_phages(&mut self, mut tx: mpsc::Sender<Phage>) -> Result<(), CmdError> {
        let n = self
            .open_modify_phage()
            .await?
            .find_all(Locator::Css("option"))
            .await?
            .len();

        for i in 1..n {
            // restart to avoid memory leak
            if i % 50 == 0 {
                self.drop().await?;
                *self = Pet::new(self.email.clone(), self.password.clone()).await;
                self.login().await?;
            }

            let mut select = self.open_modify_phage().await?;
            select
                .find(Locator::Css(&format!("option:nth-of-type({})", i)))
                .await?
                .click()
                .await?;
            self.client
                .find(Locator::Css("button[value='select_modify_phage']"))
                .await?
                .click()
                .await?;

            let name = self
                .client
                .find(Locator::Css(
                    "#view3 > form tr:nth-child(2) > td:nth-child(1)",
                ))
                .await?
                .text()
                .await?;
            let genus = self
                .client
                .find(Locator::Css("#genus > option[selected='selected']"))
                .await?
                .text()
                .await?;
            let cluster = self
                .client
                .find(Locator::Css(
                    "#modify_cluster > option[selected='selected']",
                ))
                .await?
                .text()
                .await?;
            let subcluster = self
                .client
                .find(Locator::Css("#modify_subcluster"))
                .await?
                .prop("value")
                .await?;

            let phage = Phage {
                name,
                old_names: None,
                fasta_file: None,
                end_type: None,
                genus,
                cluster,
                subcluster: match subcluster.as_ref().unwrap().as_str() {
                    "None" => None,
                    _ => subcluster,
                },
            };

            tx.send(phage).await.expect("receiver dropped");
        }

        Ok(())
    }

    async fn insert_phage(&mut self, phage: Phage, fasta_dir: &Path) -> Result<(), CmdError> {
        let subcluster = if phage.subcluster.is_none() {
            "None"
        } else {
            phage.subcluster.as_ref().unwrap()
        };

        self.client
            .find(Locator::Css("a[href='modify_phage_data']"))
            .await?
            .click()
            .await?;
        self.client.wait_for_find(Locator::Css("#cluster")).await?;
        match self
            .client
            .find(Locator::Css(&format!(
                "#cluster option[value='{}']",
                &phage.cluster
            )))
            .await
        {
            Err(CmdError::NoSuchElement(e)) => {
                println!("need to add code for updating clusters {}", e);
                return Ok(());
            }
            _ => {}
        };
        match self
            .client
            .find(Locator::Css(&format!(
                "#subcluster option[value='{}']",
                subcluster
            )))
            .await
        {
            Err(CmdError::NoSuchElement(e)) => {
                println!("need to add code for updating subclusters {}", e);
                return Ok(());
            }
            _ => {}
        };

        self.client
            .find(Locator::Css("input[name='file']"))
            .await?
            .send_keys(
                fasta_dir
                    .join(format!("{}.fasta", phage.name))
                    .to_str()
                    .unwrap(),
            )
            .await?;
        self.client
            .find(Locator::Css("#genus"))
            .await?
            .select_by_value(&phage.genus)
            .await?;
        self.client
            .find(Locator::Css("#cluster"))
            .await?
            .select_by_value(&phage.cluster)
            .await?;
        self.client
            .find(Locator::Css("#subcluster"))
            .await?
            .select_by_value(subcluster)
            .await?;

        let mut form = self
            .client
            .form(Locator::Css("form[name='uploadPhage']"))
            .await?;
        form.set_by_name("phage_name", &phage.name).await?;
        form.set_by_name(
            "circular_linear",
            &phage.end_type.unwrap().to_string().to_lowercase(),
        )
        .await?;

        form.submit().await?;

        self.client
            .wait_for_find(Locator::Css("span[style='color: green; ']"))
            .await?;

        self.client
            .find(Locator::Css("input[name='phage_name']"))
            .await?
            .send_keys(&phage.name)
            .await?;

        self.client
            .wait_for_find(Locator::Css(&format!(
                "#cluster optionnnn[value='{}']",
                &phage.cluster
            )))
            .await?;

        self.client
            .find(Locator::Css("button[value='commit']"))
            .await?
            .click()
            .await?;

        self.client
            .wait_for_find(Locator::Css("span[style='color: green; ']"))
            .await?;

        Ok(())
    }

    pub async fn insert_phages(
        &mut self,
        phages: Vec<Phage>,
        fasta_dir: &Path,
    ) -> Result<(), CmdError> {
        for phage in phages {
            self.insert_phage(phage, fasta_dir).await?;
        }

        Ok(())
    }

    pub async fn save_phages(conn: Arc<Mutex<Connection>>, mut rx: mpsc::Receiver<Phage>) {
        while let Some(phage) = rx.recv().await {
            let conn = conn.clone();
            spawn_blocking(move || {
                let conn = conn.lock().unwrap();
                let mut stmt = conn
                    .prepare(
                        "INSERT OR IGNORE INTO pet 
                                (name, genus, cluster, subcluster) 
                                VALUES (?1, ?2, ?3, ?4)",
                    )
                    .unwrap();
                stmt.execute(params!(
                    phage.name,
                    phage.genus,
                    phage.cluster,
                    phage.subcluster,
                ))
                .unwrap();
            });
        }
    }

    pub async fn drop(&mut self) -> Result<(), CmdError> {
        self.client.close().await
    }
}
