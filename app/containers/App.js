// @flow
import React, { Component } from 'react';

type Props = {
  children: React.Node
};

class App extends Component<Props> {
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default App;
