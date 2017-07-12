import React from 'react';
import WeeklyWeather from './WeeklyWeather';
import './index.css';

const WeeklyWeatherList = ({ daily }) => {
  return (
    <div className="weather-lists">
      {daily.data.map(day => <WeeklyWeather key={day.time} day={day} />)}
    </div>
  );
}

export default WeeklyWeatherList;