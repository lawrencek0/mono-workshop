// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div>
          <h2>Home</h2>
          <Login />
          <Link to="/">Home</Link>
        </div>
      </div>
    );
  }
}
