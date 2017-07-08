import React, { Component } from 'react';

class Nexus extends Component {
  render() {
    return (
      <div className="device">
        <header>
          <div className="notification-light"></div>
          <div className="camera"></div>
          <div className="speaker"></div>
        </header>
        <div className="screen"></div>
        <footer>
          <div className="speaker"></div>
        </footer>
      </div> 
    )
  }
}

export default Nexus;