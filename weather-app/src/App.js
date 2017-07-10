import React, { Component } from 'react';
import { PROXY_URL, BASE_URL, PARAM, API_KEY } from './constants';
import Nexus from './components/Nexus';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.requestLocation();
  }
  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.useLocation);
    }
  }

  useLocation(pos) {
    fetch(`${PROXY_URL}/${BASE_URL}/${PARAM}/${API_KEY}/${pos.coords.latitude},${pos.coords.longitude}`).then(res => res.json()).then(json => console.log(json));
  }

  render() {
    return (
      <div className="container">
        <Nexus />
      </div>
    );
  }
}

export default App;
