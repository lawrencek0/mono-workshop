import React from 'react';
import { sortBy } from 'lodash';

import Button from '../Button';
import Sort from '../Sort';
import './index.css';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Table = ({
                 list,
                 sortKey,
                 onSort,
                 onDismiss
               }) => {
  return (
    <div className="table">
      <div className="table-header">
        <span className="largeColumn">
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
          >
            Title
          </Sort>
        </span>
        <span className="midColumn">
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
          >
            Author
          </Sort>
        </span>
        <span className="smallColumn">
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
          >
            Comments
          </Sort>
        </span>
        <span className="smallColumn">
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
          >
            Points
          </Sort>
        </span>
        <span className="smallColumn">
          Archive
        </span>
      </div>
      { SORTS[sortKey](list).map((item) => (
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