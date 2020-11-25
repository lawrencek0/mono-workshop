import { combineEpics } from 'redux-observable';
import { epics as movies } from './movies';
import { epics as genres } from './genres';

export const rootEpic = combineEpics(movies, genres);
