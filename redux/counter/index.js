window.onload = () => {
  const initialState = {
    counter: 5
  };

  const reducer = (state = {}, action) => {
    switch (action.type) {
      case 'INCREASE_COUNTER':
        return Object.assign({}, state, {
          counter: state.counter + 1
        });
      case 'DECREASE_COUNTER':
        return Object.assign({}, state, {
          counter: state.counter - 1
        });
      default:
        return state;
    }
  }

  const updateCounter = () => {
    document.querySelector('#counter').innerText = store.getState().counter;
  }

  const store = Redux.createStore(reducer, initialState);

  store.subscribe(updateCounter);

  updateCounter();

  document.querySelector('#increase').onclick = () => store.dispatch({ type: 'INCREASE_COUNTER' });
  document.querySelector("#decrease").onclick = () => store.dispatch({ type: 'DECREASE_COUNTER' });
}