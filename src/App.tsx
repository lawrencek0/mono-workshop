import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro';
import Login from 'login/Login';
import SignUp from 'login/Signup';
import { routes } from 'routes';
import { PrimarySidebar } from 'components/sidebar/Sidebar';
import { themes, backgroundColor, primaryTextColor, media } from 'theme';

const App: React.FC = () => {
    const [theme, setTheme] = useState<themes>('light');

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
            <Wrapper>
                <PrimarySidebar routes={routes} />
                <Main>
                    <button onClick={toggleTheme}>Toggle Theme</button>
                    <Login />
                    <SignUp />
                </Main>
            </Wrapper>
        </ThemeProvider>
    );
};

// Use styled-componentes to generate the `Main` Component The attrs is used to
// use Tachyon's styling. By using colors from the theme, this component becomes
// flexible enough to switch between dark and nigh mode.
const Main = styled.main.attrs(() => ({
    className: 'mt2',
}))`
    background-color: ${backgroundColor};
    color: ${primaryTextColor};
`;

const Wrapper = styled.div.attrs(() => ({
    className: 'flex flex-column-reverse vh-100-l',
}))`
    ${media.desktop} {
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        grid-gap: 1em;
    }
`;

export default App;
