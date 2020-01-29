use fantoccini::error::CmdError;
use fantoccini::{Client, Element, Locator};

pub struct Pet {
    pub client: Client,
}

impl Pet {
    pub async fn new() -> Self {
        let client = Client::new("http://localhost:4444")
            .await
            .expect("Failed to connect to webdriver");
        Pet { client }
    }

    // @TODO: what if login fails?
    pub async fn login(&mut self, email: &str, password: &str) -> Result<Element, CmdError> {
        self.client
            .goto("http://phageenzymetools.com/login")
            .await?;
        let mut form = self.client.form(Locator::Css(".form-signin")).await?;
        form.set_by_name("email", email).await?;
        form.set_by_name("password", password).await?;
        form.submit().await?;
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await
    }

    pub async fn get_genera(&mut self) -> Result<Vec<String>, CmdError> {
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await?
            .click()
            .await?;
        self.client.wait_for_find(Locator::Css("#genera")).await?;
        let options = self
            .client
            .find_all(Locator::Css("#genera > option"))
            .await?;

        let mut genera = Vec::with_capacity(options.len());
        for mut option in options {
            let text = option
                .attr("value")
                .await?
                .expect("Genus value can't be blank");
            genera.push(text);
        }

        Ok(genera)
    }

    pub async fn open_genus(&mut self, genus: &str) -> Result<(), CmdError> {
        self.client
            .wait_for_find(Locator::Css(r#"a[href="known_phage_visualization"]"#))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css(r#"input[placeholder="Search Genera"]"#))
            .await?
            .click()
            .await?
            .wait_for_find(Locator::Css(r#"input[placeholder="Search Genera"]"#))
            .await?
            .send_keys(genus)
            .await?;
        self.client
            .find(Locator::Css(&format!(r#"li[id$=-{}]"#, genus)))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css(r#"input[placeholder="Search Enzymes"]"#))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css(r#"li[id$="-AanI"]"#))
            .await?
            .click()
            .await?;
        self.client
            .find(Locator::Css("#submit"))
            .await?
            .click()
            .await?;
        self.client
            .wait_for_find(Locator::Css(r#"select[name="cutTable_length"]"#))
            .await?
            .select_by_value("100")
            .await?;
        Ok(())
    }

    // @TODO: parse the results of scrape and maybe store in a struct?
    pub async fn scrape_phages(&mut self) -> Result<Vec<String>, CmdError> {
        let mut rows = self.client.find_all(Locator::Css("tr[id^='phage']")).await?;
        let mut phages = Vec::with_capacity(rows.len());
        for row in rows.iter_mut() {
            let info = row.text().await?;
            phages.push(info);
        }
        Ok(phages)
    }

    pub async fn drop(&mut self) -> Result<(), CmdError> {
        self.client.close().await
    }
}