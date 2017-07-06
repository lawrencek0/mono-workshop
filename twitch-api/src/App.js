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
      this.getStreams(channel);
    } else {
      this.setState({ channels: [...this.state.channels, { channelInfo, channel }] });
    }
  }

  async getStreams(stream) {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/streams/${stream}`);
    const streamInfo = await res.json();

    this.setState({ channels: [...this.state.channels, streamInfo] });
  }

  render() {
    return (
      <div>
        {this.state.channels.map((channel, index) => {
          if (!channel.stream) {
            return <div key={index}>Null</div>
          }
          return <div key={index}>{channel.stream.delay}</div>
        })}
      </div>
    );
  }
}

export default App;
