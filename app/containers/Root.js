// @flow
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from '../components/Login';

export default function Root() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}
