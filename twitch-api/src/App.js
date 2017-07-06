import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, TWITCH_CHANNELS } from './constants';
import './App.css';
import Channel from './components/Channel';

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
      this.getStreams(channel, channelInfo.logo, channelInfo.url);
    } else {
      this.setState({ channels: [...this.state.channels, { channelInfo, name: channel }] });
    }
  }

  async getStreams(stream, logo, url) {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/streams/${stream}`);
    const streamInfo = await res.json();

    this.setState({ channels: [...this.state.channels, { streamInfo, name: stream, logo, url }] });
  }

  render() {
    return (
      <div className="container">
        {this.state.channels.map((channel, index) => {
          if (!channel.logo) {
            return <Channel
              key={index}
              name={channel.name}
            >
              <em>User not found!</em>
            </Channel>
          }
          const status = channel.streamInfo.stream ? `Streaming ${channel.streamInfo.stream.game}` : '';
          return <Channel
            key={index}
            logo={channel.logo}
            name={channel.name}
            link={channel.url}
          >
            {status}
          </Channel>
        })}
      </div>
    );
  }
}

export default App;
