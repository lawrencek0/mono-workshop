import { combineReducers } from 'redux';
import { moviesReducer, MoviesState } from './movies';
import { GenresState, genresReducer } from './genres';

export interface RootState {
  movies: MoviesState;
  genres: GenresState;
}

export const rootReducer = combineReducers<RootState>({
  movies: moviesReducer,
  genres: genresReducer
});
