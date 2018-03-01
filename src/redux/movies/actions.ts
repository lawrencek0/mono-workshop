import { createAction } from 'typesafe-actions';
import { FETCH_MOVIES, FETCH_MOVIES_FULFILLED } from './types';

export const moviesActions = {
  fetchMovies: createAction(FETCH_MOVIES, () => ({
    type: FETCH_MOVIES
  })),

  fetchMoviesFullFilled: createAction(FETCH_MOVIES_FULFILLED, payload => ({
    type: FETCH_MOVIES_FULFILLED,
    payload
  }))
};
