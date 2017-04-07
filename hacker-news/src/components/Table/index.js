import React from 'react';
import Button from '../Button';
import './index.css';

const Table = ({list, onDismiss}) => {
  return (
    <div className="table">
      {list.map((item) => (
        <div key={item.objectID} className="table-row">
          <span className="largeColumn">
            <a href={item.url}>{item.title}</a>
          </span>
          <span className="midColumn">{item.author}</span>
          <span className="smallColumn">{item.num_comments}</span>
          <span className="smallColumn">{item.points}</span>
          <span className="smallColumn">
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      ))}
    </div>
  )
};

export default Table;