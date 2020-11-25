import { $call } from 'utility-types';
import { moviesActions } from './movies';
import { genresActions } from './genres';
import { navigationActions } from './navigation';

const returnsOfActions = [
  ...Object.values(moviesActions),
  ...Object.values(genresActions),
  ...Object.values(navigationActions)
].map($call);

type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;
