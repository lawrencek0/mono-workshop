import { $call } from 'utility-types';
import { moviesActions } from './movies';

const returnsOfActions = [...Object.values(moviesActions)].map($call);

type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;
