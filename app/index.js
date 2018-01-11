import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import './app.global.css';

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', async () => {
    const NextRoot = await import('./containers/Root');
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
