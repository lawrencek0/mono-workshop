import { combineEpics, Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

import { RootAction, RootState } from '..';
import { genresActions } from './';

const fetchGenre: Epic<RootAction, RootState> = (action$, store) =>
  action$.filter(isActionOf(genresActions.fetchGenres)).mergeMap(() =>
    ajax({
      url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${
        process.env.REACT_APP_TMDB_API_KEY
      }&language=en-US`,
      crossDomain: true
    }).map(res => genresActions.fetchGenresFulfilled(res.response))
  );

export const epics = combineEpics(fetchGenre);
