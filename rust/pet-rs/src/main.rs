use futures::join;
use rusqlite::{params, Connection};
use std::sync::{Arc, Mutex};
use tempfile::Builder;
use tokio::{sync::mpsc, task};

mod pet;
mod phagesdb;

async fn compare_phages(
    conn: Arc<Mutex<Connection>>,
) -> Result<Vec<phagesdb::Phage>, Box<dyn std::error::Error>> {
    let phages = task::spawn_blocking(move || {
        let conn = conn.lock().unwrap();
        let mut stmt = conn
            .prepare(
                "SELECT phagesdb.* FROM phagesdb LEFT JOIN pet
                    ON phagesdb.name = pet.name
                    WHERE pet.name IS NULL",
            )
            .unwrap();
        let phages = stmt
            .query_map(params![], |row| {
                Ok(phagesdb::Phage {
                    name: row.get(0)?,
                    genus: row.get(1)?,
                    cluster: row.get(2)?,
                    subcluster: row.get(3)?,
                    old_names: None,
                    fasta_file: row.get(5)?,
                    end_type: row.get(4)?,
                })
            })
            .unwrap();

        phages.map(|phage| phage.unwrap()).collect()
    })
    .await?;

    Ok(phages)
}

async fn update_phages(
    conn: Arc<Mutex<Connection>>,
    scrape_pet: bool,
    email: &str,
    password: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    if scrape_pet {
        let mut c = pet::Pet::new(email.to_string(), password.to_string()).await;
        c.login().await?;

        let (scrape_pet, save_pet_phages) = {
            let (tx, rx) = mpsc::channel(100);
            (c.scrape_phages(tx), pet::save_phages(conn.clone(), rx))
        };

        let (scrape_bacillus, get_phagesdb_phages, save_phagesdb_phages) = {
            let (tx, rx) = mpsc::channel(100);
            (
                phagesdb::bacillus_scraper::scrape_phages(tx.clone()),
                phagesdb::api::get_phages(tx),
                phagesdb::save_phages(conn.clone(), rx),
            )
        };

        let (scrape_bacillus, get_phagesdb_phages, save_phagesdb_phages, scrape_pet, _) = join!(
            scrape_bacillus,
            get_phagesdb_phages,
            save_phagesdb_phages,
            scrape_pet,
            save_pet_phages
        );

        (
            scrape_bacillus?,
            get_phagesdb_phages?,
            save_phagesdb_phages?,
            scrape_pet?,
        );

        c.drop().await?;
    } else {
        let (tx, rx) = mpsc::channel(100);
        let (scrape_bacillus, get_phages, save_phagesdb_phages) = (
            phagesdb::bacillus_scraper::scrape_phages(tx.clone()),
            phagesdb::api::get_phages(tx),
            phagesdb::save_phages(conn.clone(), rx),
        );
        let (scrape_bacillus, get_phages, save_phagesdb_phages) =
            join!(scrape_bacillus, get_phages, save_phagesdb_phages);
        (scrape_bacillus?, get_phages?, save_phagesdb_phages?);
    }

    Ok(())
}

async fn update_pet(
    conn: Arc<Mutex<Connection>>,
    email: &str,
    password: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let tmp_dir = Builder::new().prefix("fasta").tempdir()?;
    let new_phages = compare_phages(conn.clone()).await?;
    phagesdb::api::download_fasta_files(new_phages, tmp_dir.path()).await?;

    let new_phages = compare_phages(conn.clone()).await?;

    let mut c = pet::Pet::new(email.to_string(), password.to_string()).await;
    c.login().await?;
    let (tx, rx) = mpsc::channel(100);
    let insert_phages = c.insert_phages(new_phages, tmp_dir.path(), tx);
    let save_phages = pet::save_phages(conn.clone(), rx);
    let (insert_phages, save_phages) = join!(insert_phages, save_phages);
    (insert_phages?, save_phages?);
    c.drop().await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = Connection::open("./target/db")?;

    conn.execute_batch(
        "BEGIN;
            CREATE TABLE IF NOT EXISTS phagesdb (
                name        TEXT PRIMARY KEY,
                genus       TEXT NOT NULL,
                cluster     TEXT NOT NULL,
                subcluster  TEXT NULL,
                endType     TEXT NOT NULL,
                fastaFile   TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS phagesdb_oldnames (
                name        TEXT,
                old_names   TEXT,
                PRIMARY KEY (name, old_names),
                FOREIGN KEY (name) REFERENCES phagesdb(name)
            );
            CREATE TABLE IF NOT EXISTS pet (
                name        TEXT PRIMARY KEY,
                genus       TEXT NOT NULL,
                cluster     TEXT NOT NULL,
                subcluster  TEXT NULL
            );
        COMMIT;",
    )?;

    let pet_count: u32 = conn.query_row("SELECT COUNT(*) FROM pet", rusqlite::NO_PARAMS, |r| {
        r.get(0)
    })?;

    let conn = Arc::new(Mutex::new(conn));

    update_phages(
        conn.clone(),
        pet_count == 0,
        "email",
        "password",
    )
    .await?;

    update_pet(conn.clone(), "email", "password").await?;

    Ok(())
}

