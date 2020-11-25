import { combineReducers } from 'redux';
import { moviesReducer, MoviesState } from './movies';
import { GenresState, genresReducer } from './genres';
import { NavigationState, navigationReducer } from './navigation';

export interface RootState {
  movies: MoviesState;
  genres: GenresState;
  navigation: NavigationState;
}

export const rootReducer = combineReducers<RootState>({
  movies: moviesReducer,
  genres: genresReducer,
  navigation: navigationReducer
});
