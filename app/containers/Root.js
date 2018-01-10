// @flow
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';

export default function Root() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}
