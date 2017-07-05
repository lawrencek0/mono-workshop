import React, { Component } from 'react';
import { connect } from 'react-redux';
import CounterList from './components/CounterList';
import { increaseCounter, decreaseCounter, addCounter } from './actions';
import './App.css';

class App extends Component {
  onIncreaseTask = (id) => {
    this.props.dispatch(increaseCounter(id));
  }

  onDecreaseTask = (id) => {
    this.props.dispatch(decreaseCounter(id));
  }

  onCreateTask = ({ count }) => {
    this.props.dispatch(addCounter({ count }));
  }

  render() {
    return (
      <div>
        <CounterList
          counters={this.props.counters}
          onIncreaseTask={this.onIncreaseTask}
          onDecreaseTask={this.onDecreaseTask}
          onCreateCounter={this.onCreateTask}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    counters: state.counters
  }
}

export default connect(mapStateToProps)(App);
