use super::common;
use fantoccini::{error, Client, Locator};
use futures::future::{Future, loop_fn, Loop};

/// Opens the page containing all the phages for the given genus
pub fn open_genus<'a>(
    client: Box<impl Future<Item = Client, Error = error::CmdError>>,
    genus: common::Genera,
) -> impl Future<Item = Client, Error = error::CmdError> {
        client
            .and_then(|c| c.wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#)))
            .and_then(|e| e.click())
            .and_then(|mut c| c.find(Locator::Css(r#"input[placeholder="Search Genera"]"#)))
            .and_then(|e| e.click())
            .and_then(|c| c.wait_for_find(Locator::Css(r#"input[placeholder="Search Genera"]"#)))
            .and_then(|mut e| {
                e.send_keys(&format!("{:?}", common::Genera::Mycobacteriophage));
                Ok(e.client())
            })
            .and_then(move |mut c| c.find(Locator::Css(&format!(r#"li[id$="-{:?}"]"#, genus))))
            .and_then(|e| e.click())
            .and_then(|mut c| c.find(Locator::Css(r#"input[placeholder="Search Enzymes"]"#)))
            .and_then(|e| e.click())
            .and_then(|mut c| c.find(Locator::Css(r#"li[id$="-AanI"]"#)))
            .and_then(|e| e.click())
            .and_then(|mut c| c.find(Locator::Css("#submit")))
            .and_then(|e| e.click())
            .and_then(|c| c.wait_for_find(Locator::Css(r#"select[name="cutTable_length"]"#)))
            .and_then(|e| e.select_by_value("100"))
}

pub fn scrape_phage(client: std::sync::Arc<impl Future<Item = Client, Error = error::CmdError>>)-> Box<impl futures::Future<Item = Vec<fantoccini::Element>, Error = error::CmdError>> {
    let phages = client.and_then(|mut c| {
        c.find_all(Locator::Css(r#"tr[id^="phage"]"#))
    });

    Box::new(phages)
}

// maybe create a struct for holding phages?
pub fn scrape_phages(client: std::sync::Arc<impl Future<Item = Client, Error = error::CmdError>>)-> impl Future<Item = Vec<String>, Error = error::CmdError> {
    let scrapes = loop_fn(Vec::new(), |c| {
        scrape_phage(client.clone()).and_then(|phages| {

            if let e = client.and_then(|c| c.find(Locator::Css(r#"a#cutTable_next"#))) {
                // click on the thing
                Ok(Loop::Continue(client))
            } else {
                Ok(Loop::Break(client))
            }
            // map err element not found then call fn else break out of it?
        })
    });
    scrapes
}