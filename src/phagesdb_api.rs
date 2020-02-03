use serde::de::{self, IgnoredAny, MapAccess, Visitor};
use serde::{Deserialize, Deserializer};

use std::fmt;

#[derive(Deserialize, Debug)]
pub struct HostGenus {
    pub id: u8,
    genus_name: String,
}

#[derive(Deserialize, Debug)]
pub struct PhageList {
    count: u32,
    results: Vec<Phage>,
}

#[derive(Deserialize, Debug)]
struct Phage {
    phage_name: String,
    old_names: String,
    fasta_file: Option<String>,
    #[serde(deserialize_with = "format_end_type")]
    end_type: EndType,
    #[serde(deserialize_with = "format_genus", alias = "isolation_host")]
    genus: String,
    #[serde(deserialize_with = "format_cluster", alias = "pcluster")]
    cluster: Option<String>,
    #[serde(deserialize_with = "format_subcluster", alias = "psubcluster")]
    subcluster: Option<String>,
}

#[derive(Deserialize, Debug)]
enum EndType {
    Circular,
    Linear,
}

fn format_end_type<'de, D>(deserializer: D) -> Result<EndType, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatEndTypeVisitor;

    impl<'de> Visitor<'de> for FormatEndTypeVisitor {
        type Value = EndType;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("string or empty string from end_type")
        }

        fn visit_str<V>(self, value: &str) -> Result<Self::Value, V>
        where
            V: de::Error,
        {
            if value == "CIRC" {
                return Ok(EndType::Circular);
            }

            Ok(EndType::Linear)
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

fn format_cluster<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: Deserializer<'de>,
{
    struct FormatClusterVisitor;

    impl<'de> Visitor<'de> for FormatClusterVisitor {
        type Value = Option<String>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("an object/map from pcluster")
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
            let key = map.next_key()?.unwrap_or_default();

            if key != "cluster" {
                return Err(de::Error::unknown_field(key, &["cluster"]));
            }

            let cluster: Option<String> = map.next_value()?;

            while let Some((IgnoredAny, IgnoredAny)) = map.next_entry()? {}

            Some(cluster).ok_or_else(|| de::Error::missing_field("cluster"))
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
