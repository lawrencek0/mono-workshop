use fantoccini::{error, Client, Locator};
use futures::future::Future;

// TODO: handle login failure
pub fn login(
    client: Box<impl Future<Item = Client, Error = error::CmdError>>,
    email: String,
    password: String,
) -> Box<impl Future<Item = Client, Error = error::CmdError>> {
    Box::new(
        client
            .map_err(|_| unimplemented!())
            .and_then(|mut c| c.form(Locator::Css(".form-signin")))
            .and_then(move |mut f| f.set_by_name("email", &email))
            .and_then(move |mut f| f.set_by_name("password", &password))
            .and_then(|f| f.submit()),
    )
}
