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
  action$.filter(isActionOf(moviesActions.fetchMovies)).mergeMap(() =>
    ajax({
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.REACT_APP_TMDB_API_KEY
      }&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`,
      crossDomain: true
    }).map(res => moviesActions.fetchMoviesFullFilled(res.response))
  );

export const epics = combineEpics(fetchMovie);
