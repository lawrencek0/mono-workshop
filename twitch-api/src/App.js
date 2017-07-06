import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, TWITCH_STREAMERS } from './constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: [],
    };
  };

  componentDidMount() {
    this.getUsers()
  }

  getUsers() {
    TWITCH_STREAMERS.map(streamer => {
      return fetch(`${PROXY_URL}/${BASE_URL}/streams/${streamer}`)
        .then(res => res.json())
        .then(json => this.setState({ streams: [...this.state.streams, json] }));
    });
  }

  render() {
    return (
      <div>
        {this.state.streams.map((stream, index) => {
          if (!stream.stream) {
            return <div key={index}>Null</div>
          }
          return <div key={index}>{stream.stream.delay}</div>
        })}
      </div>
    );
  }
}

export default App;
