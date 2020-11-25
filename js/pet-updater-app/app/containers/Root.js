// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../Routes';

export default class Root extends Component<Props> {
  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}
