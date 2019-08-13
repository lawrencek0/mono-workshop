use super::common;
use fantoccini::{error, Client, Locator};
use futures::future::Future;

pub fn open_genus<'a>(
    client: Box<impl Future<Item = Client, Error = error::CmdError>>,
    genus: common::Genera,
) -> Box<impl Future<Item = Client, Error = error::CmdError>> {
    Box::new(
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
            .and_then(|c| client_wait(c, 3000)),
    )
}
