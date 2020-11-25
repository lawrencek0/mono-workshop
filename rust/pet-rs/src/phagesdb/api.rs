use futures::{stream, StreamExt};
use serde::Deserialize;
use tokio::fs::File;
use tokio::prelude::*;
use tokio::sync::mpsc;

use super::Phage;
#[derive(Deserialize, Debug)]
struct HostGenus {
    id: u8,
    genus_name: String,
}

#[derive(Deserialize, Debug)]
struct PhageList {
    count: u32,
    #[serde(alias = "results")]
    phages: Vec<Phage>,
}

pub async fn get_phages(mut tx: mpsc::Sender<Phage>) -> Result<(), reqwest::Error> {
    let res = reqwest::get("https://phagesdb.org/api/sequenced_phages/?page_size=1")
        .await?
        .json::<PhageList>()
        .await?;
    let res = reqwest::get(&format!(
        "https://phagesdb.org/api/sequenced_phages/?page_size={}",
        res.count
    ))
    .await?
    .json::<PhageList>()
    .await?;

    for phage in res.phages.into_iter() {
        tx.send(phage).await.expect("receiver dropped");
    }

    Ok(())
}

pub async fn download_fasta_files(
    phages: Vec<Phage>,
    dir: &std::path::Path,
) -> Result<(), Box<dyn std::error::Error>> {
    stream::iter(phages)
        .for_each_concurrent(8 as usize, |phage| async {
            let mut res = match reqwest::get(&phage.fasta_file.unwrap()).await {
                Ok(r) => r,
                Err(e) => unimplemented!("Add retry logic: {:?}", e),
            };
            let mut file = File::create(dir.join(format!("{}.fasta", phage.name)))
                .await
                .unwrap();
            while let Some(chunk) = res.chunk().await.unwrap() {
                file.write_all(&chunk).await.unwrap();
            }
        })
        .await;

    Ok(())
}
