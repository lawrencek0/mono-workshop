use fantoccini::{error, Client};
use futures::future::Future;

#[derive(Debug, Clone)]
pub enum Genera {
    Mycobacteriophage,
    Rhodococcus,
    Arthrobacter,
    Streptomyces,
    Bacillus,
    Gordonia,
    Corynebacterium,
    Propionibacterium,
    Actinoplanes,
    Tetrasphaera,
    Tsukamurella,
    Microbacterium,
    Dietzia,
    Rothia,
    Brevibacterium,
}

#[allow(dead_code)]
/// Helper function to pause the client from @jonhoo
pub fn client_wait(
    client: Client,
    delay: u64,
) -> impl Future<Item = Client, Error = error::CmdError> {
    use std::time::{Duration, Instant};
    use tokio::timer::Delay;

    Delay::new(Instant::now() + Duration::from_millis(delay))
        .and_then(|_| Ok(client))
        .map_err(|error| panic!("client failed to wait with error: {:?}", error))
}
