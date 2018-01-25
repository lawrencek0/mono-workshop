// @flow
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

type Props = {
  children: React.Node
};

class App extends Component<Props> {
  componentDidMount() {}
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default App;
