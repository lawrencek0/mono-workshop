import React from 'react';

const Tab = ({ name, onChangeActiveTab, isActiveTab }) => {
  return (
    <li className={`tab ${isActiveTab ? 'active' : ''}`}>
      <a onClick={onTabClick}>{name}</a>
    </li>
  )

  function onTabClick() {
    onChangeActiveTab(name);
  }
}

export default Tab;