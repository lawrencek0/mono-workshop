import React, { Component } from 'react';
import './App.css';
import Counter from './components/Counter';
import Changer from './components/Changer';

class App extends Component {
  constructor() {
    super();

    this.state = {
      count: 0
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this)
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    })
  };

  decrement() {
    this.setState({
      count: this.state.count - 1
    })
  };
  
  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6 offset-sm-3">
            <div className="card">
              <div className="card-block">
                <Counter count={this.state.count} />
                  <div className="row">
                    <div className="col-sm-6 pull-left">
                      <Changer classes="btn btn-success" update={this.increment}>+</Changer>
                    </div>
                    <div className="col-sm-6 pull-right">
                      <Changer classes="btn btn-danger right" update={this.decrement}>-</Changer>
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