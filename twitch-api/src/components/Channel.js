import React from 'react';

const Channel = ({ logo, name, status }) => {
  return (
    <div className="card">
      <div className="logo">
        <img alt={name} src={logo} />
      </div>
      <div className="name">
        <h3>{name}</h3>
      </div>
      <div className="status">
        {status}
      </div>
    </div>
  )
}

export default Channel;