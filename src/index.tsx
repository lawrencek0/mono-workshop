import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Typography from 'typography';
import noriegaTheme from 'typography-theme-noriega';
import 'tachyons';
import App from './App';
import * as serviceWorker from './serviceWorker';

const typography = new Typography(noriegaTheme);
typography.injectStyles();

ReactDOM.render(
    <ThemeProvider theme={{ mode: 'light' }}>
        <App />
    </ThemeProvider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
