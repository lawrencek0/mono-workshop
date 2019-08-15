#![recursion_limit = "128"]
mod pages;

fn main() {
    let email = String::from("email");
    let password = String::from("password");
    pages::run(email, password);
}
