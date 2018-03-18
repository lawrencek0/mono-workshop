import { createAction } from 'typesafe-actions';
import {
  UPDATE_SELECTED_GENRE,
  UPDATE_YEAR_SLIDER,
  UPDATE_RATING_SLIDER,
  UPDATE_RUNTIME_SLIDER
} from './types';

export const navigationActions = {
  updateSelectedGenre: createAction(UPDATE_SELECTED_GENRE, genre => ({
    type: UPDATE_SELECTED_GENRE,
    payload: genre
  })),

  updateYearSlider: createAction(UPDATE_YEAR_SLIDER, value => ({
    type: UPDATE_YEAR_SLIDER,
    payload: value
  })),

  updateRatingSlider: createAction(UPDATE_RATING_SLIDER, value => ({
    type: UPDATE_RATING_SLIDER,
    payload: value
  })),

  updateRuntimeSlider: createAction(UPDATE_RUNTIME_SLIDER, value => ({
    type: UPDATE_RUNTIME_SLIDER,
    payload: value
  }))
};
