import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import * as theme from './theme';
import Login from './login/Login';
import SignUp from './login/Signup';

const App: React.FC = () => {
    const [theme, setTheme] = useState<theme.themes>('light');

    const toggleTheme = (): void => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    return (
        // ThemeProvider provides the theme for all our components
        <ThemeProvider theme={{ mode: theme }}>
            <Main>
                <button onClick={toggleTheme}>Toggle Theme</button>
                <Login />
                <SignUp />
            </Main>
        </ThemeProvider>
    );
};

// Use styled-componentes to generate the `Main` Component The attrs is used to
// use Tachyon's styling. By using colors from the theme, this component becomes
// flexible enough to switch between dark and nigh mode.
const Main = styled.main.attrs(() => ({
    className: 'ma2',
}))`
    background-color: ${theme.backgroundColor};
    color: ${theme.primaryTextColor};
`;

export default App;
