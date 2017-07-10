import React from 'react';

const Tab = ({ name, onChangeActiveTab, isActiveTab }) => {
  return (
    <div className={`tab ${isActiveTab ? 'active' : ''}`}>
      <a onClick={onTabClick}>{name}</a>
    </div>
  )

  function onTabClick() {
    onChangeActiveTab(name);
  }
}

export default Tab;