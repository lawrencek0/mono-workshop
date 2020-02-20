use futures::{future, stream, StreamExt};
use rusqlite::{params, Connection};
use serde::Deserialize;
use tempfile::Builder;
use tokio::fs::File;
use tokio::prelude::*;
use tokio::task::spawn_blocking;

use std::sync::{Arc, Mutex};

use super::Phage;
#[derive(Deserialize, Debug)]
struct HostGenus {
    id: u8,
    genus_name: String,
}

#[derive(Deserialize, Debug)]
struct PhageList {
    count: u32,
    results: Vec<Phage>,
    next: Option<String>,
}

pub async fn get_host_genera() -> Result<Vec<HostGenus>, reqwest::Error> {
    reqwest::get("https://phagesdb.org/api/host_genera/")
        .await?
        .json::<Vec<HostGenus>>()
        .await
}

pub async fn get_phages(genus: u8) -> Result<Vec<Phage>, reqwest::Error> {
    let mut res = reqwest::get(&format!(
        "https://phagesdb.org/api/host_genera/{}/phagelist/?page=1",
        genus
    ))
    .await?
    .json::<PhageList>()
    .await?;

    if res.next.is_none() {
        return Ok(res
            .results
            .into_iter()
            .filter(|p| p.fasta_file.is_some())
            .collect());
    }

    let mut phages = res.results;

    loop {
        res = reqwest::get(res.next.as_ref().unwrap())
            .await?
            .json::<PhageList>()
            .await?;

        phages.extend(
            res.results
                .into_iter()
                .filter(|p| p.fasta_file.is_some())
                .collect::<Vec<Phage>>(),
        );

        if res.next.is_none() {
            return Ok(phages);
        }
    }
}

pub async fn download_fasta_files(
    phages: Vec<Phage>,
) -> Result<tempfile::TempDir, Box<dyn std::error::Error>> {
    let tmp_dir = Builder::new().prefix("fasta").tempdir()?;

    stream::iter(phages)
        .for_each_concurrent(8 as usize, |phage| async {
            let mut res = match reqwest::get(&phage.fasta_file.unwrap()).await {
                Ok(r) => r,
                Err(e) => unimplemented!("Add retry logic: {:?}", e),
            };
            let mut file = File::create(tmp_dir.path().join(format!("{}.fasta", phage.name)))
                .await
                .unwrap();
            while let Some(chunk) = res.chunk().await.unwrap() {
                file.write_all(&chunk).await.unwrap();
            }
        })
        .await;

    Ok(tmp_dir)
}

pub async fn update_phagesdb(
    conn: Arc<Mutex<Connection>>,
) -> Result<(), Box<dyn std::error::Error>> {
    let genera = get_host_genera().await?;
    let phage_lists = stream::iter(genera)
        .map(|genus| async move { get_phages(genus.id).await })
        .buffer_unordered(8);
    phage_lists
        .for_each(move |phages| {
            let conn = conn.clone();
            spawn_blocking(move || {
                let phages = phages.unwrap();
                phages
                    .iter()
                    .filter(|phage| phage.fasta_file.is_some())
                    .for_each(|phage| {
                        let conn = conn.lock().unwrap();
                        conn.execute(
                            "INSERT OR IGNORE INTO phagesdb 
                        (name, genus, cluster, subcluster, endType, fastaFile) 
                        VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                            params!(
                                phage.name,
                                phage.genus,
                                phage.cluster,
                                phage.subcluster,
                                phage.end_type.as_ref().map(|s| s.to_string()),
                                phage.fasta_file.as_ref().map(|s| s.to_string()),
                            ),
                        )
                        .unwrap();
                    });
            });
            future::ready(())
        })
        .await;
    Ok(())
}
