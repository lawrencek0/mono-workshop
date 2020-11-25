import React from 'react';
import WeatherApp from './WeatherApp';
import './Device.css';

const Device = () => {
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
          <WeatherApp />
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

export default Device;
