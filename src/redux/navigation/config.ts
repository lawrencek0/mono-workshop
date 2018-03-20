import { SliderLabel, SliderData } from './reducer';

export const DEFAULT_GENRE = 'action';
export const DEFAULT_YEAR_CONFIG = {
  label: 'year' as SliderLabel,
  min: 1990,
  max: 2017,
  step: 1,
  value: {
    min: 2000,
    max: 2017
  }
};
export const DEFAULT_RATING_CONFIG: SliderData = {
  label: 'rating' as SliderLabel,
  min: 0,
  max: 10,
  step: 1,
  value: {
    min: 8,
    max: 10
  }
};
export const DEFAULT_RUNTIME_CONFIG: SliderData = {
  label: 'runtime' as SliderLabel,
  min: 0,
  max: 300,
  step: 15,
  value: {
    min: 60,
    max: 120
  }
};
