use crossterm::{
    event::{self, Event, KeyCode, KeyEvent},
    Result,
};
use std::sync::mpsc::{self, Receiver};
use std::thread;

fn read_char(buf: &mut Vec<u8>) -> Result<usize> {
    loop {
        if let Event::Key(KeyEvent { code, .. }) = event::read()? {
            match code {
                KeyCode::Enter => {
                    buf[0] = b'\r';
                    buf[1] = b'\n';
                }
                KeyCode::Char(c) => {
                    c.encode_utf8(buf.as_mut());
                }
                _ => {}
            };

            return Ok(2);
        }
    }
}

fn read_line(buf: &mut Vec<u8>) -> Result<usize> {
    let mut n = 0;

    while let Event::Key(KeyEvent { code, .. }) = event::read()? {
        match code {
            KeyCode::Enter => {
                break;
            }
            KeyCode::Char(c) => {
                buf.push(c as u8);
                n += 1;
            }
            _ => {}
        }
    }
    Ok(n)
}

pub fn spawn_stdin_channel() -> Receiver<(usize, Vec<u8>)> {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || loop {
        let mut buf = vec![0; 5];

        let n = if true {
            read_char(&mut buf).unwrap()
        } else {
            read_line(&mut buf).unwrap()
        };

        tx.send((n, buf)).unwrap();
    });
    rx
}
