import React, { ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';
import { backgroundColor, primaryTextColor } from 'theme';
import styled from 'styled-components/macro';

export const Content: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    return <Main>{children}</Main>;
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
