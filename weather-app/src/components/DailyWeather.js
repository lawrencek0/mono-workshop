import React from 'react';
import ReactSkycons from './ReactSkycons';
import './DailyWeather.css';

const DailyWeather = ({ currently, hourly, minutely }) => (
  <div className="daily-weather">
    <div className="overview">
      <div className="weather-info">
      </div>
      <div className="weather-icon">
        <ReactSkycons icon={`${currently.icon.toUpperCase()}`} autoplay={true} />
      </div>
    </div>
  </div>
);

export default DailyWeather;