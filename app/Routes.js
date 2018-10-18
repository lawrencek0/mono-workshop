/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Login from './components/Login';

export default () => (
  <App>
    <Switch>
      <Route path={routes.LOGIN} component={Login} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
