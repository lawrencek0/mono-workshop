import { createAction } from 'typesafe-actions';
import { FETCH_MOVIES, FETCH_MOVIES_FULFILLED } from './types';
import { RangeData } from '../../components/SideBar';

export interface TmdbApiParams {
  genreId: number;
  year: RangeData;
  rating: RangeData;
  runtime: RangeData;
}

export const moviesActions = {
  fetchMovies: createAction(FETCH_MOVIES, payload => ({
    type: FETCH_MOVIES,
    payload
  })),

  fetchMoviesFullFilled: createAction(FETCH_MOVIES_FULFILLED, payload => ({
    type: FETCH_MOVIES_FULFILLED,
    payload
  }))
};
