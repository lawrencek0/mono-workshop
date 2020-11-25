let _id = 0;

export function uniqueId() {
  return _id++;
}

export function increaseCounter(id) {
  return {
    type: 'INCREASE_COUNTER',
    payload: {
      id
    }
  };
}

export function decreaseCounter(id) {
  return {
    type: 'DECREASE_COUNTER',
    payload: {
      id
    }
  };
}

export function addCounter({ count }) {
  return {
    type: 'ADD_COUNTER',
    payload: {
      id: uniqueId(),
      count
    }
  };
}