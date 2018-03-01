import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer, rootEpic, RootState } from './redux';

function configureStore(initialState?: RootState) {
  const middlewares = [createEpicMiddleware(rootEpic)];

  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

  return createStore(rootReducer, initialState!, enhancer);
}

const store = configureStore();

export default store;
