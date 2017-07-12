import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY, TABS } from '../constants';
import Tab from './Tab';
import DailyWeather from './DailyWeather';
import './Weather.css';

class WeatherApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {},
      activeTab: 'Today',
    }
  }

  componentDidMount() {
    this.requestLocation();
  }

  isActiveTab = (tabName) => {
    return this.state.activeTab === tabName;
  }

  changeActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  setWeather = (weather) => {
    this.setState({ weather });
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
    const { currently, daily } = this.state.weather;

    if (!currently) return <div>Loading...</div>

    return (
      <div className="weather-app">
        <div className="tabs">
          {TABS.map((tab, index) => (
            <Tab
              key={index}
              name={tab}
              onChangeActiveTab={this.changeActiveTab}
              isActiveTab={this.isActiveTab(tab)}
            />
          ))}
        </div>
        {this.state.activeTab === 'Today' ?
          <DailyWeather
            currently={currently}
            daily={daily.data[0]}
          />
          : ''
        }
      </div>
    )
  }
}

export default WeatherApp;