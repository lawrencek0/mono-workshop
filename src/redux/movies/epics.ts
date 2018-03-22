import { combineEpics, Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/observable/from';
import 'rxjs/add/operator/map';

import { RootAction, RootState } from '../';
import { moviesActions } from './';

const fetchMovie: Epic<RootAction, RootState> = (action$, store) =>
  action$.filter(isActionOf(moviesActions.fetchMovies)).mergeMap(action =>
    ajax({
      url: action.payload,
      crossDomain: true
    }).map(res => moviesActions.fetchMoviesFullFilled(res.response))
  );

export const epics = combineEpics(fetchMovie);
