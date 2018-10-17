// @flow
import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';

type Props = {
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    );
  }
}
