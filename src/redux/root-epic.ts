import { combineEpics } from 'redux-observable';
import { epics as movies } from './movies';

export const rootEpic = combineEpics(movies);
