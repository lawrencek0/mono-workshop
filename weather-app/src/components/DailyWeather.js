import React from 'react';
import ReactSkycons from './ReactSkycons';
import './DailyWeather.css';

const DailyWeather = ({ currently, hourly, minutely, daily }) => (
  <div className="daily-weather">
    <div className="overview">
      <div className="weather-info">
        <div>{currently.time}</div>
        <div className="max-min">
          <span className="max">
            Max {daily.temperatureMax}
          </span>
          <span className="min">
            Min {daily.temperatureMin}
          </span>
        </div>
        <div className="temp">
          <span className="temp-number">{currently.temperature}</span>
          <span className="temp-unit">F</span>
        </div>
        <div className="apparent-temp">
          Feels like {currently.apparentTemperature}
        </div>
      </div>
      <div className="weather-icon">
        <ReactSkycons icon={`${currently.icon.toUpperCase()}`} autoPlay={true} />
      </div>
    </div>
  </div>
);

export default DailyWeather;