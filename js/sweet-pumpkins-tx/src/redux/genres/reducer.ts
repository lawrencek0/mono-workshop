import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { genresActions } from './';

export interface Genre {
  readonly id: number;
  readonly name: string;
}

export type GenresState = {
  readonly isFetching: boolean;
  readonly errMessage: string | null;
  readonly genres: Genre[];
};

export type RootState = {
  readonly movies: GenresState;
};

export const genresReducer = combineReducers<GenresState>({
  isFetching: (state = false, action) => {
    switch (action.type) {
      case getType(genresActions.fetchGenres):
        return true;
      case getType(genresActions.fetchGenresFulfilled):
        return false;
      default:
        return state;
    }
  },
  errMessage: (state = '', action) => {
    switch (action.type) {
      default:
        return state;
    }
  },
  genres: (state = [], action) => {
    switch (action.type) {
      case getType(genresActions.fetchGenresFulfilled): {
        return action.payload;
      }
      default:
        return state;
    }
  }
});

import { $call } from 'utility-types';
const returnsOfActions = Object.values(genresActions).map($call);
export type GenresAction = typeof returnsOfActions[number];
