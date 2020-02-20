use futures::{future, stream, StreamExt};
use rusqlite::types::{FromSql, FromSqlResult, ValueRef};
use rusqlite::{params, Connection};
use serde::de::{self, IgnoredAny, MapAccess, Visitor};
use serde::{Deserialize, Deserializer};
use tempfile::Builder;
use tokio::fs::File;
use tokio::prelude::*;
use tokio::task::spawn_blocking;

use std::fmt::{self, Debug, Display, Formatter};
use std::sync::{Arc, Mutex};

#[derive(Deserialize, Debug)]
pub struct HostGenus {
    pub id: u8,
    pub genus_name: String,
}

#[derive(Deserialize, Debug)]
struct PhageList {
    count: u32,
    results: Vec<Phage>,
    next: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct Phage {
    #[serde(alias = "phage_name")]
    pub name: String,
    #[serde(deserialize_with = "format_old_names")]
    pub old_names: Option<Vec<String>>,
    pub fasta_file: Option<String>,
    #[serde(deserialize_with = "format_end_type")]
    pub end_type: Option<EndType>,
    #[serde(deserialize_with = "format_genus", alias = "isolation_host")]
    pub genus: String,
    #[serde(deserialize_with = "format_cluster", alias = "pcluster")]
    pub cluster: String,
    #[serde(deserialize_with = "format_subcluster", alias = "psubcluster")]
    pub subcluster: Option<String>,
}

#[derive(Deserialize, Debug)]
pub enum EndType {
    Circular,
    Linear,
}

impl Display for EndType {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Debug::fmt(self, f)
    }
}

impl FromSql for EndType {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        value.as_str().and_then(|s| match s {
            "Circular" => Ok(EndType::Circular),
            "Linear" => Ok(EndType::Linear),
            _ => unimplemented!(),
        })
    }
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

fn format_old_names<'de, D>(deserializer: D) -> Result<Option<Vec<String>>, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatOldNamesVisitor;

    impl<'de> Visitor<'de> for FormatOldNamesVisitor {
        type Value = Option<Vec<String>>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("string containing old names separated by comma")
        }

        fn visit_str<V>(self, value: &str) -> Result<Self::Value, V>
        where
            V: de::Error,
        {
            if value == "" {
                return Ok(None);
            }

            Ok(Some(
                value.split(',').map(|s| s.trim().to_string()).collect(),
            ))
        }
    }

    deserializer.deserialize_str(FormatOldNamesVisitor)
}

fn format_end_type<'de, D>(deserializer: D) -> Result<Option<EndType>, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatEndTypeVisitor;

    impl<'de> Visitor<'de> for FormatEndTypeVisitor {
        type Value = Option<EndType>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("string or empty string from end_type")
        }

        fn visit_str<V>(self, value: &str) -> Result<Self::Value, V>
        where
            V: de::Error,
        {
            if value == "CIRC" {
                return Ok(Some(EndType::Circular));
            }

            Ok(Some(EndType::Linear))
        }
    }

    deserializer.deserialize_str(FormatEndTypeVisitor)
}

fn format_genus<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatGenusVisitor;

    impl<'de> Visitor<'de> for FormatGenusVisitor {
        type Value = String;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("an object/map from isolation_host")
        }

        fn visit_map<V>(self, mut map: V) -> Result<Self::Value, V::Error>
        where
            V: MapAccess<'de>,
        {
            let key = map.next_key()?.unwrap_or_default();

            if key != "genus" {
                return Err(de::Error::unknown_field(key, &["isolation_host"]));
            }

            let genus: Option<String> = map.next_value()?;

            while let Some((IgnoredAny, IgnoredAny)) = map.next_entry()? {}

            genus
                .map(|g| {
                    if g == "Mycobacterium" {
                        return String::from("Mycobacteriophage");
                    }
                    g
                })
                .ok_or_else(|| de::Error::missing_field("isolation_host/genus"))
        }
    }

    deserializer.deserialize_map(FormatGenusVisitor)
}

fn format_cluster<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatClusterVisitor;

    impl<'de> Visitor<'de> for FormatClusterVisitor {
        type Value = String;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("an object/map from pcluster")
        }

        fn visit_unit<E>(self) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            Ok(String::from("Unclustered"))
        }

        fn visit_map<V>(self, mut map: V) -> Result<Self::Value, V::Error>
        where
            V: MapAccess<'de>,
        {
            let key = map.next_key()?.unwrap_or_default();

            if key != "cluster" {
                return Err(de::Error::unknown_field(key, &["cluster"]));
            }

            let cluster: Option<String> = map.next_value()?;

            while let Some((IgnoredAny, IgnoredAny)) = map.next_entry()? {}

            cluster.ok_or_else(|| de::Error::missing_field("cluster"))
        }
    }

    deserializer.deserialize_any(FormatClusterVisitor)
}

fn format_subcluster<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatSubClusterVisitor;

    impl<'de> Visitor<'de> for FormatSubClusterVisitor {
        type Value = Option<String>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("an object/map from psubcluster")
        }

        fn visit_unit<E>(self) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            Ok(None)
        }

        fn visit_map<V>(self, mut map: V) -> Result<Self::Value, V::Error>
        where
            V: MapAccess<'de>,
        {
            let key = map.next_key()?;

            if key.is_none() {
                return Ok(None);
            }

            let key = key.unwrap();

            if key != "subcluster" {
                return Err(de::Error::unknown_field(key, &["subcluster"]));
            }

            let cluster: Option<String> = map.next_value()?;

            while let Some((IgnoredAny, IgnoredAny)) = map.next_entry()? {}

            Some(cluster).ok_or_else(|| de::Error::missing_field("subcluster"))
        }
    }

    deserializer.deserialize_any(FormatSubClusterVisitor)
}
