import React from 'react';
import styled from 'styled-components/macro';
import { RouteComponentProps } from '@reach/router';
import * as theme from 'theme';
import { useAuthDispatch, logout } from 'auth/hooks';

const Dashboard: React.FC<RouteComponentProps> = () => {
    const dispatch = useAuthDispatch();

    return (
        <Main>
            <button
                onClick={() => {
                    logout(dispatch);
                }}
            >
                logout
            </button>
        </Main>
    );
};

// Use styled-componentes to generate the `Main` Component The attrs is used to
// use Tachyon's styling. By using colors from the theme, this component becomes
// flexible enough to switch between dark and nigh mode.
const Main = styled.main.attrs(() => ({
    className: 'ma2',
}))<RouteComponentProps>`
    background-color: ${theme.backgroundColor};
    color: ${theme.primaryTextColor};
`;

export { Dashboard };
