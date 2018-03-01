import { Dispatch as ReduxDispatch, Reducer as ReduxReducer } from 'redux';
import { RootState, RootAction } from './index';

export type Dispatch = ReduxDispatch<RootAction>;
export type Reducer = ReduxReducer<RootState>;
export type Api = {};
