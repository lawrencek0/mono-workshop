use futures::join;
use rusqlite::{params, Connection};
use tokio::sync::mpsc;
use tokio::task::spawn_blocking;

use std::sync::{Arc, Mutex};

mod pet;
mod phagesdb_api;

async fn update_phages(
    conn: Arc<Mutex<Connection>>,
) -> Result<Vec<phagesdb_api::Phage>, Box<dyn std::error::Error>> {
    let phages = spawn_blocking(move || {
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
                Ok(phagesdb_api::Phage {
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

    let mut c = pet::Pet::new(
        String::from("email"),
        String::from("password"),
    )
    .await;
    c.login().await?;

    let pet_count: u32 = conn.query_row("SELECT COUNT(*) FROM pet", rusqlite::NO_PARAMS, |r| {
        r.get(0)
    })?;

    let conn = Arc::new(Mutex::new(conn));

    // only scrape PET whent the database is empty
    if pet_count == 0 {
        let (tx, rx) = mpsc::channel(100);
        let update_phagesdb = phagesdb_api::update_phagesdb(conn.clone());
        let scrape_pet = c.scrape_phages(tx);
        let save_pet = pet::save_phages(conn.clone(), rx);
        let (scrape_pet, _, update_phagesdb) = join!(scrape_pet, save_pet, update_phagesdb);
        (scrape_pet?, update_phagesdb?);
    } else {
        phagesdb_api::update_phagesdb(conn.clone()).await?;
    }
    let new_phages = update_phages(conn.clone()).await?;

    let temp_dir = phagesdb_api::download_fasta_files(new_phages).await?;
    let new_phages = update_phages(conn.clone()).await?;
    {
        let (tx, rx) = mpsc::channel(30);
        let insert_phages = c.insert_phages(new_phages, temp_dir.path(), tx);
        let save_phages = pet::save_phages(conn.clone(), rx);
        let (insert_phages, _) = join!(insert_phages, save_phages);
        insert_phages?;
    }
    c.drop().await?;

    Ok(())
}
