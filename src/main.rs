use futures::{future, join, stream, StreamExt};
use rusqlite::{params, Connection};
use std::sync::{Arc, Mutex};
use tokio::task::spawn_blocking;

mod pet;
mod phagesdb_api;

async fn update_phagesdb(conn: Arc<Mutex<Connection>>) -> Result<(), Box<dyn std::error::Error>> {
    let genera = phagesdb_api::get_host_genera().await?;
    let phage_lists = stream::iter(genera)
        .map(|genus| async move { phagesdb_api::get_phages(genus.id).await })
        .buffer_unordered(8);
    phage_lists
        .for_each(move |phages| {
            let conn = conn.clone();
            spawn_blocking(move || {
                let phages = phages.unwrap();
                phages.iter().for_each(|phage| {
                    let conn = conn.lock().unwrap();
                    let mut stmt = conn
                        .prepare(
                            "INSERT OR IGNORE INTO phagesdb 
                                (name, genus, cluster, subcluster, endType) 
                                VALUES (?1, ?2, ?3, ?4, ?5)",
                        )
                        .unwrap();
                    stmt.execute(params!(
                        phage.phage_name,
                        phage.genus,
                        phage.cluster,
                        phage.subcluster,
                        phage.end_type.as_ref().map(|s| s.to_string())
                    ))
                    .unwrap();
                });
            });
            future::ready(())
        })
        .await;
    Ok(())
}

async fn scrape_pet(
    conn: Arc<Mutex<Connection>>,
    c: &mut pet::Pet,
) -> Result<(), Box<dyn std::error::Error>> {
    let email = "email";
    let password = "password";

    if let Err(e) = c.login(email, password).await {
        // @FIXME: it never times out when the element is not found
        // instead after login check the url (login to home page), it should be more thane nough to verify
        // maybe interrupt wait a duration and check for the red error text?
        eprintln!("Failed to login {}", e);
    }

    let genera = c.get_genera().await?;
    for genus in genera {
        c.open_genus(&genus).await?;
        let phages = c.scrape_phages().await?;
        for phage in phages {
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
                    phage.phage_name,
                    phage.genus,
                    phage.cluster,
                    phage.subcluster,
                ))
                .unwrap();
            });
        }
    }
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
                endType     TEXT NOT NULL
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

    let conn = Arc::new(Mutex::new(conn));
    let mut c = pet::Pet::new().await;
    {
        let phagesdb = update_phagesdb(conn.clone());
        let pet = scrape_pet(conn.clone(), &mut c);
        let (phagesdb, pet) = join!(phagesdb, pet);
        (phagesdb?, pet?);
    }
    c.drop().await?;

    Ok(())
}
