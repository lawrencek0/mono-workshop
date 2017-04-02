import React, { Component } from 'react';
import './App.css';

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
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6 offset-sm-3">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title text-center">Counter: {this.state.counter}</h4>
                  <div className="row">
                    <div className="col-sm-6 pull-left">
                      <button className="btn btn-success" onClick={this.increment}>+</button>
                    </div>
                    <div className="col-sm-6 pull-right">
                      <button className="btn btn-danger right" onClick={this.decrement}>-</button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;