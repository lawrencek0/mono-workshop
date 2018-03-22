import { combineEpics, Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/observable/from';
import 'rxjs/add/operator/map';

import * as api from './constants';
import { RootAction, RootState } from '../';
import { moviesActions } from './';

const fetchMovie: Epic<RootAction, RootState> = (action$, store) =>
  action$
    .filter(isActionOf(moviesActions.fetchMovies))
    .mergeMap(({ payload: { genreId, year, rating, runtime } }) =>
      ajax({
        url:
          `${api.PATH_BASE}${api.PATH_DISCOVER}${api.PATH_MOVIE}?` +
          `${api.PARAM_API_KEY}=${process.env.REACT_APP_TMDB_API_KEY}&` +
          `${api.PARAM_LANGUAGE}=${api.DEFAULT_LANGUAGE}&` +
          `${api.PARAM_SORT_BY}=${api.DEFAULT_SORT_BY}&` +
          `${api.PARAM_WITH_GENRES}=${genreId}&` +
          `${api.PARAM_PRIMARY_RELEASE_DATE}.${api.MODIFIER_GREATER_THAN}=${
            year.min
          }-01-01&` +
          `${api.PARAM_PRIMARY_RELEASE_DATE}.${api.MODIFIER_LESS_THAN}=${
            year.max
          }-12-31&` +
          `${api.PARAM_VOTE_AVERAGE}.${api.MODIFIER_GREATER_THAN}=${
            rating.min
          }&` +
          `${api.PARAM_VOTE_AVERAGE}.${api.MODIFIER_LESS_THAN}=${rating.max}&` +
          `${api.PARAM_WITH_RUNTIME}.${api.MODIFIER_GREATER_THAN}=${
            runtime.min
          }&` +
          `${api.PARAM_WITH_RUNTIME}.${api.MODIFIER_LESS_THAN}=${
            runtime.max
          }&` +
          `${api.PARAM_PAGE}=${api.DEFAULT_PAGE}&`,
        crossDomain: true
      }).map(res => moviesActions.fetchMoviesFullFilled(res.response))
    );

export const epics = combineEpics(fetchMovie);
