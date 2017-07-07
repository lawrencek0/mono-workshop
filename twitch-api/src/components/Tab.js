import React from 'react';

const Tab = ({ isActive, name, onChangeActive }) => {
  return (
    <div className={`tab ${isActive ? 'active' : ''}`}>
      <a onClick={onTabClick}>{name}</a>
    </div>
  );

  function onTabClick() {
    onChangeActive(name);
  }
}

export default Tab;