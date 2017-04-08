import React, { Component } from 'react';
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

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
        <span className="largeColumn">
          <Sort
            sortKey={'TITLE'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Title
          </Sort>
        </span>
          <span className="midColumn">
          <Sort
            sortKey={'AUTHOR'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Author
          </Sort>
        </span>
          <span className="smallColumn">
          <Sort
            sortKey={'COMMENTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Comments
          </Sort>
        </span>
          <span className="smallColumn">
          <Sort
            sortKey={'POINTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Points
          </Sort>
        </span>
          <span className="smallColumn">
          Archive
        </span>
        </div>
        { reverseSortedList.map((item) => (
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
  }
}

export default Table;