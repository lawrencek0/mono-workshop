import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal, ThemeProvider, dayTheme } from './theme';
import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
   @import url('https://fonts.googleapis.com/css?family=Amatic+SC:700|Andika');

  html {
    box-sizing: border-box;
  }
  
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Andika', sans-serif;
    line-height: 1.4;
    margin: 0;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={dayTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
