import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      counter: 0
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this)
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    })
  };

  decrement() {
    this.setState({
      counter: this.state.counter - 1
    })
  }

  render() {
    return(
      <div>
        <h2>Counter: {this.state.counter}</h2>
        <div>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        </div>
      </div>
    )
  }
}

export default App;