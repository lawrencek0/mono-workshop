import React from 'react';
import moment from 'moment';
import ReactSkycons from '../ReactSkycons';

const WeeklyWeather = ({ day }) => {
  return (
    <div className="weather-panel">
      <div className="overview">
        <span className="date">{formatTime(day.time)}</span>
        <span className="summary">{day.summary.split(' ').slice(0, 2).join(' ')}</span>
      </div>
      <div className="weather-info">
        <div className="weather-icon">
        <ReactSkycons
        icon={`${day.icon.toUpperCase()}`}
      />
        </div>
        <div className="temp">
          <div className="max">
            {Math.round(day.temperatureMax)}
          </div>
          <div className="min">
            {Math.round(day.temperatureMin)}
          </div>
        </div>
      </div>
    </div>
  );

  function formatTime(time) {
    const t = new Date(time);
    return moment.unix(t).format("dddd, MMM D");
  }
}

export default WeeklyWeather;