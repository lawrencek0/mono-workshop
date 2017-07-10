import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY } from '../constants';

class WeatherApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {},
    }
  }

  componentDidMount() {
    this.requestLocation();
  }

  setWeather = (weather) => {
    this.setState(weather);
  }

  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.fetchWeatherInfo);
    }
  }

  fetchWeatherInfo = async (pos) => {
    const res = await fetch(`${PROXY_URL}/${BASE_URL}/${PARAM}/${API_KEY}/${pos.coords.latitude},${pos.coords.longitude}`);
    const weatherInfo = await res.json();

    this.setWeather(weatherInfo);
  }

  render() {
    return (
      <div className="weather-screen">
      </div>
    )
  }
}

export default WeatherApp;