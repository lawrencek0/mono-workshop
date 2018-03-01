import { combineReducers } from 'redux';
import { moviesReducer, MoviesState } from './movies';

export interface RootState {
  movies: MoviesState;
}

export const rootReducer = combineReducers<RootState>({
  movies: moviesReducer
});
