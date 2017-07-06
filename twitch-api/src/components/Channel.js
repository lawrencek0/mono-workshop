import React from 'react';

const Channel = ({ logo, name, status }) => {
  return (
    <div className="card">
      <div className="logo">
        <img src={logo} />
      </div>
      <div className="name">
        <h3>{stream}</h3>
      </div>
      <div className="status">
        {status}
      </div>
    </div>
  )
}