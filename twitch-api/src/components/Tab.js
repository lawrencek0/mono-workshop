import React from 'react';

const Tab = ({ isActive, name, onChangeActive }) => {
  return (
    <button className={`tabs ${isActive ? 'active' : ''}`} onClick={onTabClick}>{name}</button>
  );

  function onTabClick() {
    onChangeActive(name);
  }
}

export default Tab;