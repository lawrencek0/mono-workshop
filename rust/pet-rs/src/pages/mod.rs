mod common;
mod known_phages;
mod login;

use fantoccini::{error, Client, Locator};
use futures::future::Future;

// TODO: handle NewSessionError
fn start(url: &str) -> Box<impl Future<Item = Client, Error = error::CmdError>> {
    Box::new(
        Client::new(url)
            .map_err(|_| unimplemented!())
            .and_then(|mut c| {
                c.set_window_rect(0, 0, 800, 800);
                c.goto("http://phageenzymetools.com/login")
            }),
    )
}

pub fn run(email: String, password: String) {
    let client = start("http://localhost:4444");
    let client = login::login(client, email, password);
    let client = known_phages::open_genus(Box::new(client), common::Genera::Mycobacteriophage)
        .map(|_| ())
        .map_err(|e| eprintln!("{}", e));
    tokio::run(client);
}
