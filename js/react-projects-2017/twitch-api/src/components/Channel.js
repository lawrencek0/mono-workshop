import React from 'react';

const Channel = ({ logo, name, link, children }) => {
  return (
    <div className="card">
      <div className="logo">
        <img alt={name} src={logo} />
      </div>
      <div className="info">
        <a href={link} className={`name ${checkStatus()}`}>
          {name}
        </a>
        <span className="status">
          {children}
        </span>
      </div>
    </div>
  );

  function checkStatus() {
    if (!children) return 'offline';
    if (!logo) return;
    return 'online';
  }
}

export default Channel;