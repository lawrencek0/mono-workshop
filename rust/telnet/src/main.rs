use telnet::Client;

mod telnet;

fn main() -> std::io::Result<()> {
    let mut client = Client::new("telehack.com:23")?;
    loop {
        client.process()?;
    }
    Ok(())
}
