import { genresReducer, Genre } from './reducer';
import { genresActions } from './index';

const genres: Genre[] = [
  {
    id: 28,
    name: 'Action'
  }
];
const initalState = genresReducer(undefined, {});

describe('genres reducer', () => {
  describe('initial state', () => {
    expect(initalState).toMatchSnapshot();
  });

  describe('adding genres', () => {
    it('should add a new genre', () => {
      const action = genresActions.fetchGenresFulfilled(genres);
      const state = genresReducer(initalState, action);
      // expect(state.genres).toHaveLength(1);
      // expect(state.genres[0].id).toEqual(action.payload[0].id);
    });
  });
});
