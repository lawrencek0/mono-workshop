import React from 'react';

const More = ({ toggleUnit, unit }) => {
  return (
  <div className="more">
    <div className="toggles">
    <span disabled={isActive('F')} >
      <a onClick={toggleUnit}>&deg;F</a>
    </span>
    <span disabled={isActive('C')} >
      <a onClick={toggleUnit}>&deg;C</a>
    </span>
    </div>
  </div>
  );

  function isActive(val) {
    if (val === unit) {
      return 'active';
    }

    return null;
  }
}

export default More;