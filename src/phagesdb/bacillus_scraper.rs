use fantoccini::{error::CmdError, Client, Locator};
use tokio::sync::mpsc;

use super::{EndType, Phage};

pub async fn scrape_phages(mut tx: mpsc::Sender<Phage>) -> Result<(), CmdError> {
    let caps = r#"{
        "moz:firefoxOptions": {
            "args": [""]
        }
    }"#;

    let mut client =
        Client::with_capabilities("http://localhost:4445", serde_json::from_str(caps).unwrap())
            .await
            .expect("Failed to connect to webdriver");

    client.goto("http://bacillus.phagesdb.org/phages/").await?;

    let mut rows = client
        .wait_for_find(Locator::Css("#allphages"))
        .await?
        .find_all(Locator::Css("tbody > tr"))
        .await?;

    let mut phage_names = Vec::with_capacity(rows.len());

    for row in rows.iter_mut() {
        let phage_name = row
            .find(Locator::Css("td:first-of-type"))
            .await?
            .html(true)
            .await?;
        phage_names.push(phage_name);
    }

    for phage_name in phage_names {
        let (mut cluster, mut subcluster, mut fasta_file, mut end_type) = (None, None, None, None);

        client
            .goto(&format!(
                "http://bacillus.phagesdb.org/phages/{}",
                phage_name
            ))
            .await?;

        let mut table = client.wait_for_find(Locator::Css("#phageDetails")).await?;
        let mut rows = table.find_all(Locator::Css("tbody > tr")).await?;

        for (_i, row) in rows.iter_mut().enumerate() {
            match row.find(Locator::Css(".detailLabel")).await {
                Ok(mut r) => {
                    let txt = r.text().await?;

                    match txt.as_str() {
                        "Former names" => {
                            // TODO: handle old names
                            let _old_name =
                                row.find(Locator::Css(".detailValue")).await?.text().await?;
                        }
                        "Fasta file available?" => {
                            let value =
                                row.find(Locator::Css(".detailValue")).await?.text().await?;

                            if value != "No" {
                                fasta_file = row
                                    .find(Locator::Css(".detailValue a"))
                                    .await?
                                    .attr("href")
                                    .await?
                            }
                        }
                        "Cluster" => {
                            cluster =
                                Some(row.find(Locator::Css(".detailValue")).await?.text().await?);
                        }
                        "Subcluster" => {
                            let x = row.find(Locator::Css(".detailValue")).await?.text().await?;
                            subcluster = match x.as_str() {
                                "--" => None,
                                _ => Some(x),
                            }
                        }
                        "Character of genome ends" => {
                            let end = row.find(Locator::Css(".detailValue")).await?.text().await?;
                            end_type = if end.as_str().to_lowercase().contains("circular") {
                                Some(EndType::Circular)
                            } else {
                                Some(EndType::Linear)
                            };
                        }
                        _ => {}
                    };
                }
                Err(_) => {}
            }
        }

        let name = client
            .find(Locator::Css("#contentHeader span"))
            .await?
            .text()
            .await?;

        if fasta_file.is_some() {
            let phage = Phage {
                name,
                old_names: None,
                fasta_file,
                end_type,
                genus: String::from("Bacillus"),
                cluster: cluster.unwrap(),
                subcluster,
            };

            tx.send(phage).await.expect("receiver dropped");
        }
    }

    client.close().await?;
    Ok(())
}
