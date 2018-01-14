// @flow
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from '../components/Login';
import App from './App';

export default function Root() {
  return (
    <App>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </App>
  );
}
