import React, { ReactNode, lazy } from 'react';
import { RouteComponentProps } from '@reach/router';
import tw from 'tailwind.macro';
import { backgroundColor, primaryTextColor, media } from 'theme';
import styled from 'styled-components/macro';
import { primaryRoutes, secondayRoutes } from 'routing/routes';
import { Sidebar } from './Sidebar';
import { AppBar } from './AppBar';

export const Main: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    return (
        <Wrapper>
            <Sidebar routes={primaryRoutes} />
            <div>
                <StyledAppBar />
                <Content>{children}</Content>
            </div>
        </Wrapper>
    );
};

// Use styled-componentes to generate the `Main` Component The attrs is used to
// use Tachyon's styling. By using colors from the theme, this component becomes
// flexible enough to switch between dark and nigh mode.
const Content = styled.main.attrs(() => ({
    className: 'mh2 mh0-l mt2',
}))`
    flex-grow: 1;
    background-color: ${backgroundColor};
    color: ${primaryTextColor};
`;

const StyledAppBar = styled(AppBar)``;

const Wrapper = styled.div.attrs(() => ({
    className: 'flex flex-column-reverse flex-row-l',
}))`
    @supports (display: grid) {
        ${media.desktop} {
            display: grid;
            grid-template-columns: min-content 1fr;
            grid-gap: 1rem;
        }
    }
`;
