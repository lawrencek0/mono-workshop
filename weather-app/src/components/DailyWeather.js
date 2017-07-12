import React from 'react';
import moment from 'moment';
import ReactSkycons from './ReactSkycons';
import './DailyWeather.css';

const DailyWeather = ({ currently, daily }) => {
  return (
    <div className="daily-weather">
      <div className="overview">
        <div className="weather-icon">
          <div className="date">
            {formatTime(currently.time)}
          </div>
          <ReactSkycons
            icon={`${currently.icon.toUpperCase()}`}
            autoPlay={true}
          />
          <div className="summary">
            {currently.summary}
          </div>
        </div>
        <div className="weather-info">
          <div className="max">
            Max {Math.round(daily.temperatureMax)}
          </div>
          <div className="min">
            Min {Math.round(daily.temperatureMin)}
          </div>
          <div className="temp">
            <span className="temp-number">
              {Math.round(currently.temperature)}
            </span>
            <span className="temp-unit">&deg;F</span>
          </div>
          <div className="apparent-temp">
            Feels like {Math.round(currently.apparentTemperature)}
          </div>
        </div>
      </div>
    </div>
  );

  function formatTime(time) {
    const t = new Date(time);
    return moment.unix(t).format("MMMM D, h:mm");
  }
}

export default DailyWeather;