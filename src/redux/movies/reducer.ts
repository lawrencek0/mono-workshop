import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { moviesActions } from './actions';

export interface Movie {
  id: number;
  title: string;
  genreIds: number[];
  voteCount: number;
  voteAverage: number;
  releaseDate: string;
  posterPath: string;
  className?: string;
}

export type MoviesState = {
  readonly isFetching: boolean;
  readonly errMessage: string | null;
  readonly movies: Movie[];
};

export type RootState = {
  movies: MoviesState;
};

export const moviesReducer = combineReducers<MoviesState>({
  isFetching: (state = false, action) => {
    switch (action.type) {
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
  movies: (state = [], action) => {
    switch (action.type) {
      case getType(moviesActions.fetchMovies):
        return state;

      case getType(moviesActions.fetchMoviesFullFilled): {
        return [...state, ...action.payload.results];
      }
      default:
        return state;
    }
  }
});

import { $call } from 'utility-types';
const returnsOfActions = Object.values(moviesActions).map($call);
export type MoviesAction = typeof returnsOfActions[number];
