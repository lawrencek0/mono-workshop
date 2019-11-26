import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppProviders } from 'AppProviders';
import './styles/tailwind.out.css';
import { DayNightThemeProvider } from 'themes/hooks';

ReactDOM.render(
    <StrictMode>
        <DayNightThemeProvider>
            <AppProviders>
                <App />
            </AppProviders>
        </DayNightThemeProvider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
