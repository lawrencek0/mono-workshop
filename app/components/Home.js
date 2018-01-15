// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    ipcRenderer.on('login-request', () => {
      console.log('Changing history!');
      this.props.history.push('/login');
    });
    // when saved password fro keytar is wrong
    // TODO: if successfully logged in set global username or show indicator?
    ipcRenderer.on('login-user-reply', (event, isLoggedIn) => {
      if (!isLoggedIn) {
        this.props.history.push('/login');
      }
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
