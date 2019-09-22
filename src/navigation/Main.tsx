import React, { ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';
import { backgroundColor, primaryTextColor, media } from 'theme';
import styled from 'styled-components/macro';
import { primaryRoutes, secondayRoutes } from 'routing/routes';
import { PrimarySidebar, SecondarySidebar } from './Sidebar';

export const Main: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    return (
        <Wrapper>
            <PrimarySidebar routes={primaryRoutes} />
            <Content>{children}</Content>
            <SecondarySidebar routes={secondayRoutes} />
        </Wrapper>
    );
};

// Use styled-componentes to generate the `Main` Component The attrs is used to
// use Tachyon's styling. By using colors from the theme, this component becomes
// flexible enough to switch between dark and nigh mode.
const Content = styled.main.attrs(() => ({
    className: 'mt2',
}))`
    flex-grow: 1;
    background-color: ${backgroundColor};
    color: ${primaryTextColor};
`;

const Wrapper = styled.div.attrs(() => ({
    className: 'flex flex-column-reverse flex-row-l',
}))`
    @supports (display: grid) {
        ${media.desktop} {
            display: grid;
            grid-template-columns: 100px 1fr 80px;
            grid-gap: 1rem;
        }
    }
`;
