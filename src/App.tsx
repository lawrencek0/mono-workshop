import React from 'react';
import styled from 'styled-components/macro';
import Login from 'login/Login';
import { useAuthState } from 'auth/hooks';
import * as theme from 'theme';

const App: React.FC = () => {
    const { email } = useAuthState();

    if (!email) {
        return <Login />;
    }

    return (
        // ThemeProvider provides the theme for all our components
        <Main>{email}</Main>
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
