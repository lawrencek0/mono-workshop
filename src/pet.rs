use fantoccini::error::CmdError;
use fantoccini::{Client, Element, Locator};
use rusqlite::{params, Connection};
use tokio::sync::mpsc;
use tokio::task::spawn_blocking;

use crate::phagesdb_api::{Phage, EndType};
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

    async fn insert_phage(
        &mut self,
        phage: Phage,
        fasta_dir: &Path,
        tx: &mut mpsc::Sender<Phage>,
    ) -> Result<(), CmdError> {
        let subcluster = match phage.subcluster.as_ref() {
            Some(s) => s,
            None => "None"
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
                    .join(format!("{}.fasta", &phage.name))
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
            .select_by_value(&subcluster)
            .await?;

        let mut form = self
            .client
            .form(Locator::Css("form[name='uploadPhage']"))
            .await?;
        form.set_by_name("phage_name", &phage.name).await?;
        form.set_by_name(
            "circular_linear",
            match phage.end_type {
                Some(EndType::Circular) => "circular",
                Some(EndType::Linear) => "linear",
                _ => unreachable!("shouldn't be null in pet")
            },
        )
        .await?;

        form.submit().await?;

        self.client
            .wait_for_find(Locator::Css("span[style='color: green; ']"))
            .await?;

        self.client
            .find(Locator::Css("button[value='commit']"))
            .await?
            .click()
            .await?;

        self.client
            .wait_for_find(Locator::Css("span[style='color: green; ']"))
            .await?;

        tx.send(phage).await.expect("receiver dropped");

        Ok(())
    }

    pub async fn insert_phages(
        &mut self,
        phages: Vec<Phage>,
        fasta_dir: &Path,
        mut tx: mpsc::Sender<Phage>,
    ) -> Result<(), CmdError> {
        for phage in phages {
            self.insert_phage(phage, fasta_dir, &mut tx).await?;
        }

        Ok(())
    }

    pub async fn drop(&mut self) -> Result<(), CmdError> {
        self.client.close().await
    }
}

pub async fn save_phages(conn: Arc<Mutex<Connection>>, mut rx: mpsc::Receiver<Phage>) {
    while let Some(phage) = rx.recv().await {
        let conn = conn.clone();
        spawn_blocking(move || {
            let conn = conn.lock().unwrap();
            conn.execute(
                "INSERT OR IGNORE INTO pet 
                        (name, genus, cluster, subcluster) 
                        VALUES (?1, ?2, ?3, ?4)",
                params!(phage.name, phage.genus, phage.cluster, phage.subcluster,),
            )
            .unwrap();
        });
    }
}
