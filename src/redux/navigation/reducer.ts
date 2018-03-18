import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { navigationActions } from './actions';
import * as config from './config';

export type SliderLabel = 'year' | 'rating' | 'runtime';

export interface SliderData {
  readonly label: SliderLabel;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly value: {
    readonly min: number;
    readonly max: number;
  };
}

export type NavigationState = {
  readonly selectedGenre: string;
  readonly year: SliderData;
  readonly rating: SliderData;
  readonly runtime: SliderData;
};

export type RootState = {
  readonly navigation: NavigationState;
};

export const navigationReducer = combineReducers<NavigationState>({
  selectedGenre: (state = config.DEFAULT_GENRE, action) => {
    switch (action.type) {
      case getType(navigationActions.updateSelectedGenre):
        return action.payload;
      default:
        return state;
    }
  },
  year: (state = config.DEFAULT_YEAR_CONFIG, action) => {
    switch (action.type) {
      case getType(navigationActions.updateYearSlider):
        return [...state, action.payload];
      default:
        return state;
    }
  },
  rating: (state = config.DEFAULT_RATING_CONFIG, action) => {
    switch (action.type) {
      case getType(navigationActions.updateRatingSlider):
        return [...state, action.payload];
      default:
        return state;
    }
  },
  runtime: (state = config.DEFAULT_RUNTIME_CONFIG, action) => {
    switch (action.type) {
      case getType(navigationActions.updateRuntimeSlider):
        return [...state, action.payload];
      default:
        return state;
    }
  }
});
