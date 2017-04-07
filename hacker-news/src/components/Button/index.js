import React from 'react';
import './index.css';

const Button = ({onClick, className = '', children}) =>
  <button
    className={className}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>

export default Button;