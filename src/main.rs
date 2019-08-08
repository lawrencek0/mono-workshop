mod pages;

fn main() {
    let email = String::from("GET_EMAIL_FROM_FILE?");
    let password = String::from("GET_PASSWORD_FROM_ENV?");
    pages::run(email, password);
}
