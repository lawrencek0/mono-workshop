import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import Device from './Device';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Device />, document.getElementById('root'));
registerServiceWorker();
