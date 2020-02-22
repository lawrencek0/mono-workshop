use fantoccini::error::CmdError;
use fantoccini::{Client, Element, Locator};
use rusqlite::{params, Connection};
use tokio::sync::mpsc;
use tokio::task;

use crate::phagesdb::{EndType, Phage};
use std::path::Path;
use std::sync::{Arc, Mutex};

pub struct Pet {
    pub client: Client,
    email: String,
    password: String,
}

enum ModifyPhageTab {
    UploadPhage,
    DeletePhage,
    ModifyPhage,
    EditClusterSubcluster,
    AddDeleteGenus,
}

impl Pet {
    pub async fn new(email: String, password: String) -> Self {
        let caps = r#"{
            "moz:firefoxOptions": {
                "args": [""]
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

    async fn open_modify_phage_data_tab(&mut self, tab: ModifyPhageTab) -> Result<(), CmdError> {
        self.client
            .goto("http://phageenzymetools.com/modify_phage_data")
            .await?;
        self.client
            .wait_for_find(Locator::Css(&format!("a[href='#view{}']", (tab as u8) + 1)))
            .await?
            .click()
            .await?;
        Ok(())
    }

    pub async fn scrape_phages(&mut self, mut tx: mpsc::Sender<Phage>) -> Result<(), CmdError> {
        self.open_modify_phage_data_tab(ModifyPhageTab::ModifyPhage)
            .await?;
        let n = self
            .client
            .wait_for_find(Locator::Css("#select_modify_phage"))
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

            self.open_modify_phage_data_tab(ModifyPhageTab::ModifyPhage)
                .await?;
            let mut select = self
                .client
                .wait_for_find(Locator::Css("#select_modify_phage"))
                .await?;
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

    async fn add_cluster(&mut self, cluster: &str) -> Result<(), CmdError> {
        self.open_modify_phage_data_tab(ModifyPhageTab::EditClusterSubcluster)
            .await?;
        self.client
            .wait_for_find(Locator::Css("#ui-id-1"))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css("#add_cluster"))
            .await?
            .send_keys(cluster)
            .await?;
        self.client
            .find(Locator::Css("button[value='add_cluster']"))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css("p[style='color: green;']"))
            .await?;
        Ok(())
    }

    async fn add_subcluster(&mut self, cluster: &str, subcluster: &str) -> Result<(), CmdError> {
        let subcluster_num = subcluster
            .chars()
            .skip_while(|c| c.is_alphabetic())
            .collect::<String>();

        self.open_modify_phage_data_tab(ModifyPhageTab::EditClusterSubcluster)
            .await?;
        self.client
            .wait_for_find(Locator::Css("#ui-id-3"))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css("#add_subcluster_cluster"))
            .await?
            .select_by_value(cluster)
            .await?;
        self.client
            .find(Locator::Css("#add_subcluster_subcluster"))
            .await?
            .send_keys(&subcluster_num)
            .await?;
        self.client
            .find(Locator::Css("button[value='add_subcluster']"))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css("p[style='color: green;']"))
            .await?;

        Ok(())
    }

    async fn insert_phage(
        &mut self,
        phage: Phage,
        fasta_dir: &Path,
        tx: &mut mpsc::Sender<Phage>,
    ) -> Result<(), CmdError> {
        self.open_modify_phage_data_tab(ModifyPhageTab::UploadPhage)
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
            Err(CmdError::NoSuchElement(_)) => {
                self.add_cluster(&phage.cluster).await?;
                self.open_modify_phage_data_tab(ModifyPhageTab::UploadPhage)
                    .await?;
            }
            _ => {}
        };

        self.client
            .find(Locator::Css("#cluster"))
            .await?
            .select_by_value(&phage.cluster)
            .await?;

        let subcluster = match phage.subcluster.as_ref() {
            Some(s) => s,
            None => "None",
        };
        match self
            .client
            .find(Locator::Css(&format!(
                "#subcluster option[value='{}']",
                subcluster
            )))
            .await
        {
            Err(CmdError::NoSuchElement(_)) => {
                self.add_subcluster(&phage.cluster, subcluster).await?;
                self.open_modify_phage_data_tab(ModifyPhageTab::UploadPhage)
                    .await?;
                self.client
                    .find(Locator::Css("#cluster"))
                    .await?
                    .select_by_value(&phage.cluster)
                    .await?;
            }
            _ => {}
        };

        self.client
            .find(Locator::Css("#subcluster"))
            .await?
            .select_by_value(&subcluster)
            .await?;

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

        let end_type = match phage.end_type {
            Some(EndType::Circular) => "circular",
            Some(EndType::Linear) => "linear",
            _ => unreachable!("shouldn't be null in pet"),
        };
        self.client
            .find(Locator::Css(&format!("input[value='{}']", end_type)))
            .await?
            .click()
            .await?;

        let mut form = self
            .client
            .form(Locator::Css("form[name='uploadPhage']"))
            .await?;
        form.set_by_name("phage_name", &phage.name).await?;
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

pub async fn save_phages(
    conn: Arc<Mutex<Connection>>,
    mut rx: mpsc::Receiver<Phage>,
) -> Result<(), task::JoinError> {
    while let Some(phage) = rx.recv().await {
        let conn = conn.clone();
        task::spawn_blocking(move || {
            let conn = conn.lock().unwrap();
            conn.execute(
                "INSERT OR IGNORE INTO pet 
                        (name, genus, cluster, subcluster) 
                        VALUES (?1, ?2, ?3, ?4)",
                params!(phage.name, phage.genus, phage.cluster, phage.subcluster,),
            )
            .unwrap();
        })
        .await?;
    }

    Ok(())
}
