import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf, addDecorator, RenderFunction } from '@storybook/react';
import Login from 'login/Login';

const StyledComponentsDecorator = (storyFn: RenderFunction): JSX.Element => (
    <ThemeProvider theme={{ mode: 'light' }}>
        <>{storyFn()}</>
    </ThemeProvider>
);

addDecorator(StyledComponentsDecorator);

storiesOf('Login', module).add('to Storybook', () => <Login />);
