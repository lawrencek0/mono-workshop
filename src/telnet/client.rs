use crossterm::terminal::enable_raw_mode;
use std::convert::TryFrom;
use std::io::{self, prelude::*, BufReader, BufWriter};
use std::net::TcpStream;
use std::sync::mpsc::Receiver;

use super::{Command, Option, TerminalType};
use crate::terminal;

struct Configuration {
    should_echo: bool,
    should_supress_ga: bool,
}

pub struct Client {
    input: BufReader<TcpStream>,
    output: BufWriter<TcpStream>,
    configuration: Configuration,
    input_channel: Receiver<(usize, Vec<u8>)>,
}

impl Client {
    pub fn new(addr: &str) -> io::Result<Self> {
        let stream = TcpStream::connect(addr)?;
        stream.set_nonblocking(true)?;

        let configuration = Configuration {
            should_echo: false,
            should_supress_ga: false,
        };

        Ok(Self {
            input: BufReader::new(stream.try_clone()?),
            output: BufWriter::new(stream),
            configuration,
            input_channel: terminal::spawn_stdin_channel(),
        })
    }

    pub fn run(&mut self) -> io::Result<()> {
        loop {
            if let Ok((n, input)) = self.input_channel.try_recv() {
                self.output.write_all(&input[..n])?;
            }

            self.process()?;
            self.output.flush()?;
        }

        Ok(())
    }

    pub fn process(&mut self) -> io::Result<()> {
        let mut buf = [0; 2048];

        if let Ok(mut n) = self.input.read(&mut buf[..]) {
            // request more bytes if its an IAC
            if n == 1 && buf[0] == Command::IAC.into() {
                loop {
                    match self.input.read(&mut buf[1..]) {
                        Ok(o) => {
                            n += o;
                            break;
                        }
                        Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => {}
                        Err(e) => return Err(e),
                    }
                }
            }

            let mut iter = buf.iter().take(n);

            let mut stdout = BufWriter::new(io::stdout());

            while let Some(byte) = iter.next() {
                match Command::try_from(*byte) {
                    Ok(Command::IAC) => {
                        match Command::try_from(
                            *iter
                                .next()
                                .unwrap_or_else(|| panic!("no actual command! {}",)),
                        )
                        .unwrap()
                        {
                            Command::WILL => {
                                let opt = Option::try_from(*iter.next().unwrap()).unwrap();
                                match opt {
                                    Option::SuppressGA => {
                                        self.configuration.should_supress_ga = true;
                                        enable_raw_mode().expect("could not enter raw mode");
                                        self.output.write_all(&[
                                            Command::IAC.into(),
                                            Command::DO.into(),
                                            Option::SuppressGA.into(),
                                        ])?;
                                    }
                                    Option::Echo => {
                                        self.configuration.should_echo = true;
                                        // maybe change writer from bufreader to smth else?
                                        self.send_command(&[
                                            Command::DO.into(),
                                            Option::Echo.into(),
                                        ])?;
                                    }
                                    _ => unimplemented!("opt for will {:?}", opt),
                                }
                            }
                            Command::DO => {
                                let opt = Option::try_from(*iter.next().unwrap()).unwrap();
                                match opt {
                                    Option::TerminalType => {
                                        // TODO: then what?
                                        self.output.write_all(&[
                                            Command::IAC.into(),
                                            Command::WILL.into(),
                                            Option::TerminalType.into(),
                                        ])?;
                                    }
                                    Option::NAWS => {
                                        // TODO: get actual width nd height
                                        let (width, height) =
                                            (174u16.to_be_bytes(), 48u16.to_be_bytes());

                                        self.output.write_all(&[
                                            Command::IAC.into(),
                                            Command::WILL.into(),
                                            Option::NAWS.into(),
                                        ])?;
                                        // subneg time
                                        self.output.write_all(&[
                                            Command::IAC.into(),
                                            Command::SB.into(),
                                            Option::NAWS.into(),
                                        ])?;
                                        self.output.write(&width)?;
                                        self.output.write(&height)?;
                                        self.output.write_all(&[
                                            Command::IAC.into(),
                                            Command::SE.into(),
                                        ])?;
                                    }
                                    _ => unimplemented!("opt for do {:?}", opt),
                                }
                            }
                            Command::SB => {
                                let opt = Option::try_from(*iter.next().unwrap()).unwrap();
                                match opt {
                                    Option::TerminalType => {
                                        if TerminalType::try_from(*iter.next().unwrap()).unwrap()
                                            == TerminalType::SEND
                                        {
                                            self.output.write_all(&[
                                                Command::IAC.into(),
                                                Command::SB.into(),
                                                Option::TerminalType.into(),
                                                TerminalType::IS.into(),
                                            ])?;
                                            self.output.write(b"xterm-256color")?;
                                            self.output.write_all(&[
                                                Command::IAC.into(),
                                                Command::SE.into(),
                                            ])?;
                                            assert_eq!(iter.next().unwrap(), &Command::IAC.into());
                                            assert_eq!(iter.next().unwrap(), &Command::SE.into());
                                        }
                                    }
                                    _ => unimplemented!(),
                                }
                            }
                            _ => unimplemented!("not implemented command"),
                        }
                    }
                    Ok(c) => unimplemented!("Command {:?} coming soon", c),
                    Err(_) => {
                        stdout.write(&[*byte])?;
                    }
                }
            }

            stdout.flush()?;
        }

        Ok(())
    }

    fn send_command(&mut self, cmd: &[u8]) -> io::Result<()> {
        self.output
            .write_all(&[&[Command::IAC.into()], cmd].concat())
    }
}
