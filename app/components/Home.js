// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    ipcRenderer.on('login-request', () => {
      this.props.history.push('/login');
    });
  }
  render() {
    return (
      <div>
        <div>mayhaps</div>
      </div>
    );
  }
}

export default withRouter(Home);
