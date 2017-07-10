import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY } from './constants';
import Nexus from './components/Nexus';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.requestLocation();
  }
  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.useLocation);
    }
  }

  async useLocation(pos) {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/${PARAM}/${API_KEY}/${pos.coords.latitude},${pos.coords.longitude}`);
    const weatherInfo = await res.json();
    console.log(weatherInfo);
  }

  render() {
    return (
      <div className="container">
        <Nexus />
      </div>
    );
  }
}

export default App;
