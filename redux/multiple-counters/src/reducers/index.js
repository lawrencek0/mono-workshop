import { uniqueId } from '../actions';

const mockCounters = [
  {
    id: uniqueId(),
    count: 10
  },
  {
    id: uniqueId(),
    count: -5
  }
];

export default function counters(state = { counters: mockCounters }, action) {
  switch (action.type) {
    case 'INCREASE_COUNTER':
      return {
        counters: state.counters.map(counter => {
          if (counter.id === action.payload.id) {
            return {
              ...counter,
              count: +counter.count + 1
            }
          }
          return counter;
        })
      };
    case 'DECREASE_COUNTER':
      return {
        counters: state.counters.map(counter => {
          if (counter.id === action.payload.id) {
            return {
              ...counter,
              count: counter.count - 1
            }
          }
          return counter;
        })
      };
    case 'ADD_COUNTER':
      return { counters: state.counters.concat(action.payload) };
    default:
      return state;
  }
}