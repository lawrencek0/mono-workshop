import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, TWITCH_CHANNELS } from './constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
    };
  };

  componentDidMount() {
    TWITCH_CHANNELS.map(channel => this.getChannels(channel));
  }

  async getChannels(channel) {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/channels/${channel}`);
    const channelInfo = await res.json();

    if (!channelInfo.error) {
      this.getStreams(channel, channelInfo.logo);
    } else {
      this.setState({ channels: [...this.state.channels, { channelInfo, channel }] });
    }
  }

  async getStreams(stream, logo) {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/streams/${stream}`);
    const streamInfo = await res.json();

    this.setState({ channels: [...this.state.channels, { streamInfo, stream, logo }] });
  }

  render() {
    return (
      <div>
        {this.state.channels.map((channel, index) => {
          if (!channel.logo) {
            return <div key={index}>Deleted</div>
          }
          return <div key={index}>{channel.logo}</div>
        })}
      </div>
    );
  }
}

export default App;
