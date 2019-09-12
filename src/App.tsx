import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import * as theme from './theme';
import Login from './login/Login';
import SignUp from './login/Signup';

const App: React.FC = () => {
    const [theme] = useState('light');

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <Main>
                <Login />
                <SignUp />
            </Main>
        </ThemeProvider>
    );
};

const Main = styled.main.attrs(() => ({
    className: 'ma2',
}))`
    background-color: ${theme.backgroundColor};
    color: ${theme.primaryTextColor};
`;

export default App;
