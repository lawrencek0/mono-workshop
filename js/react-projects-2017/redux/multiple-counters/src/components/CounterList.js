import React, { Component } from 'react';
import Counter from './Counter';

class CounterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      count: 0,
    };
  }

  onCountChange = e => {
    this.setState({ count: e.target.value });
  }

  resetForm() {
    this.setState({
      showForm: false,
      count: 0,
    });
  }

  onCreateCounter = e => {
    e.preventDefault();
    this.props.onCreateCounter({
      count: this.state.count,
    });
    this.resetForm();
  }

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm });
  }

  render() {
    return (
      <div className="container">
        {!this.state.showForm && (
          <button
            className="new"
            onClick={this.toggleForm}
          >
            + New Counter
          </button>
        )}
        {this.state.showForm && (
          <form
            className="new"
            onSubmit={this.onCreateCounter}
          >
            <label>{this.state.count}</label>
            <input
              type="range"
              value={this.state.count}
              onChange={this.onCountChange}
            />
            <button type="submit">Save</button>
          </form>
        )}

        {this.props.counters.map(counter => (
          <Counter
            counter={counter}
            key={counter.id}
            onIncreaseTask={this.props.onIncreaseTask}
            onDecreaseTask={this.props.onDecreaseTask}
          />
        ))}

      </div>
    );
  }
}

export default CounterList;