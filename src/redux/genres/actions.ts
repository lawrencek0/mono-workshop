import { createAction } from 'typesafe-actions';
import { FETCH_GENRES, FETCH_GENRES_FULFILLED } from './types';

export const genresActions = {
  fetchGenres: createAction(FETCH_GENRES),

  fetchGenresFulfilled: createAction(FETCH_GENRES_FULFILLED, payload => ({
    type: FETCH_GENRES_FULFILLED,
    payload
  }))
};
