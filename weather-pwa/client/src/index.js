import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';
import weather from './reducers';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Root from './components/Root';

const store = createStore(weather, applyMiddleware(thunk), devToolsEnhancer());

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
