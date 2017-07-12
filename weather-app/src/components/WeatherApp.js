import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY, TABS } from '../constants';
import Tab from './Tab';
import DailyWeather from './DailyWeather';
import WeeklyWeatherList from './WeeklyWeather/';
import More from './More';
import './WeatherApp.css';

class WeatherApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {},
      activeTab: 'Today',
      unit: 'F',
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

  setUnit = (unit) => {
    this.setState({ unit });
  }

  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.fetchWeatherInfo);
    }
  }

  toggleUnit = () => {
    this.requestLocation();
    const unit = this.state.unit === 'F' ? 'C' : 'F';    
    this.setState({unit});
  }

  fetchWeatherInfo = async (pos) => {
    const unit = this.state.unit === 'F' ? 'us' : 'si';

    const res = await fetch(`${PROXY_URL}/${BASE_URL}/${PARAM}/${API_KEY}/${pos.coords.latitude},${pos.coords.longitude}?units=${unit}&exclude=minutely,hourly,alerts,flags`);
    const weatherInfo = await res.json();

    this.setWeather(weatherInfo);
  }

  render() {
    const { currently, daily } = this.state.weather;

    if (!currently) return <div>Loading...</div>

    return (
      <div className="weather-app">
        <ul className="tabs">
          {TABS.map((tab, index) => (
            <Tab
              key={index}
              name={tab}
              onChangeActiveTab={this.changeActiveTab}
              isActiveTab={this.isActiveTab(tab)}
            />
          ))}
          </ul>
        {this.state.activeTab === 'Today' ?
          <DailyWeather
            currently={currently}
            daily={daily.data[0]}
            unit={this.state.unit}
          />
          : ''
        }

        {this.state.activeTab === 'Weekly' ?
          <WeeklyWeatherList daily={daily} />
          : ''
        }

        {this.state.activeTab === 'More' ?
          <More 
            toggleUnit={this.toggleUnit} 
            unit={this.state.unit}
          /> 
          : ''
        }

      </div>
    )
  }
}

export default WeatherApp;