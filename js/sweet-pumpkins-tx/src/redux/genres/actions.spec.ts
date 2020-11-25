import { genresActions } from './actions';
import { FETCH_GENRES } from './types';

describe('Genres Actions', () => {
  it('should create an action to fetch genres', () => {
    const expectedAction = { type: FETCH_GENRES };
    expect(genresActions.fetchGenres()).toEqual(expectedAction);
  });
});
