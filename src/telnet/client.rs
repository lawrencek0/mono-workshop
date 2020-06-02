use std::convert::TryFrom;
use std::io::prelude::*;
use std::io::{BufReader, BufWriter};
use std::net::TcpStream;

use super::{Command, Option, TerminalType};

pub struct Client {
    input: BufReader<TcpStream>,
    output: BufWriter<TcpStream>,
}

impl Client {
    pub fn new(addr: &str) -> std::io::Result<Self> {
        let stream = TcpStream::connect(addr)?;

        Ok(Self {
            input: BufReader::new(stream.try_clone()?),
            output: BufWriter::new(stream),
        })
    }

    pub fn process(&mut self) -> std::io::Result<()> {
        let mut buf = [0; 2048];

        let n = self.input.read(&mut buf[..])?;

        if n == 1 {
            self.input.read(&mut buf[1..])?;
        }

        let mut iter = buf.iter().take_while(|b| **b != 0);

        let stdout = std::io::stdout();
        let mut stdout = BufWriter::new(stdout.lock());

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
                                    self.output.write_all(&[
                                        Command::IAC.into(),
                                        Command::DO.into(),
                                        Option::SuppressGA.into(),
                                    ])?;
                                }
                                Option::Echo => {
                                    self.output.write_all(&[
                                        Command::IAC.into(),
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
                                        // subneg time
                                        Command::IAC.into(),
                                        Command::SB.into(),
                                        width[0],
                                        width[1],
                                        height[0],
                                        height[1],
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

        self.output.flush()?;
        stdout.flush()?;

        Ok(())
    }
}
