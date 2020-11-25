import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, TWITCH_CHANNELS, STATUSES } from './constants';
import './App.css';
import Channel from './components/Channel';
import Tab from './components/Tab';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      filter: 'All'
    };
  };

  componentDidMount() {
    TWITCH_CHANNELS.map(channel => this.getChannels(channel));
  }

  isActive = (filter) => {
    return this.state.filter === filter;
  }

  changeActive = (activeFilter) => {
    this.setState({ filter: activeFilter });
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
        <div className="tabs">
          {STATUSES.map((status, index) => (
            <Tab
              key={index}
              onChangeActive={this.changeActive}
              isActive={this.isActive(status)}
              name={status}
            />
          ))}
        </div>

        {this.state.channels.map((channel, index) => {
          if (!channel.logo && this.state.filter === 'All') {
            return <Channel
              key={index}
              name={channel.name}
            >
              <em>User not found!</em>
            </Channel>
          } else if (!channel.logo) return;

          const status = channel.streamInfo.stream ? `Streaming ${channel.streamInfo.stream.game}` : null;
          if (this.state.filter === 'All' || (this.state.filter === 'Offline' && !status)) {
            return <Channel
              key={index}
              logo={channel.logo}
              name={channel.name}
              link={channel.url}
            >
              {status}
            </Channel>
          }

          if (this.state.filter === 'Online' && status) {
            return <Channel
              key={index}
              logo={channel.logo}
              name={channel.name}
              link={channel.url}
            >
              {status}
            </Channel>
          }
        })}
      </div>
    );
  }
}

export default App;
