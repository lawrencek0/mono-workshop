use num_enum::{IntoPrimitive, TryFromPrimitive};

pub use client::Client;

mod client;

#[derive(Debug, Eq, PartialEq, IntoPrimitive, TryFromPrimitive)]
#[repr(u8)]
pub enum Option {
    // When the echoing option is in effect, the party at the end performing the echoing is expected to transmit (echo) data characters it receives back to the sender of the data characters
    Echo = 1,
    // When the SUPPRESS-GO-AHEAD option is in effect on the connection between a sender of data and the receiver of the data, the sender need not transmit GAs
    SuppressGA = 3,
    // Willingness to exchange terminal-type information is agreed upon via conventional Telnet option negotiation. WILL and DO are used only to obtain and grant permission for future discussion. The actual exchange of status information occurs within option subcommands
    TerminalType = 24,
    // The window size information is conveyed via this option from the Telnet client to the Telnet server. The information is advisory. The server may accept the option, but not use the information that is sent
    NAWS = 31,
}

#[derive(Debug, Eq, PartialEq, IntoPrimitive, TryFromPrimitive)]
#[repr(u8)]
pub enum TerminalType {
    IS = 0,
    SEND = 1,
}

#[derive(Debug, Eq, PartialEq, IntoPrimitive, TryFromPrimitive)]
#[repr(u8)]
pub enum Command {
    // End of subnegotiation parameters
    SE = 240,
    // No operation
    NOP = 241,
    // The data stream portion of a Synch. This should always be accompanied by a TCP Urgent notification
    DataMark = 242,
    // NVT character BRK.
    Break = 243,
    // The function Interrupt Process
    IP = 244,
    // The function Abort Output
    AO = 245,
    // The function Are You There
    AYT = 246,
    // The function Erase character
    EC = 247,
    // The function Erase Line
    EL = 248,
    // The Go Ahead signal
    GA = 249,
    // Indicates that what follows is subnegotiation of the indicated option
    SB = 250,
    // Indicates the desire to begin performing, or confirmation that you are now performing, the indicated option
    WILL = 251,
    // Indicates the refusal to perform, or continue performing, the indicated option
    WONT = 252,
    // Indicates the request that the other party perform, or confirmation that you are expecting the other party to perform, the indicated option
    DO = 253,
    // Indicates the demand that the other party stop performing, or confirmation that you are no longer expecting the other party to perform, the indicated option
    DONT = 254,
    // Data Byte 255
    IAC = 255,
}
