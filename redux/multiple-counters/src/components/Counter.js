import React from 'react';

const Counter = ({ counter, onIncreaseTask, onDecreaseTask }) => {
  return (
    <div className="counter">
      <div className="counter-title">
        <span>Counter {counter.id}</span>
        <strong>{counter.count}</strong>
      </div>
      <hr />
      <div className="counter-controls">
        <button className="increase" onClick={onIncreaseClick}>+</button>
        <button className="decrease" onClick={onDecreaseClick}>-</button>
      </div>
    </div>
  );

  function onIncreaseClick() {
    onIncreaseTask(counter.id);
  }

  function onDecreaseClick() {
    onDecreaseTask(counter.id);
  }
}

export default Counter;