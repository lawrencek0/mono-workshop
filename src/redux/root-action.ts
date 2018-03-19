import { $call } from 'utility-types';
import { moviesActions } from './movies';
import { genresActions } from './genres';

const returnsOfActions = [
  ...Object.values(moviesActions),
  ...Object.values(genresActions)
].map($call);

type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;
