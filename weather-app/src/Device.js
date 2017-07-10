import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY } from './constants';
import './Device.css';

class Device extends Component {
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
        <div className="device">
          <header>
            <div className="notification-light"></div>
            <div className="camera"></div>
            <div className="speaker"></div>
          </header>
          <div className="screen">
            <div className="power-button"></div>
            <div className="volume-button"></div>
            <div className="nav">
              <div className="back"></div>
              <div className="home"></div>
              <div className="overview"></div>
            </div>
          </div>
          <footer>
            <div className="speaker"></div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Device;
