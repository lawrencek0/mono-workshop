import React, { ReactNode, lazy } from 'react';
import { RouteComponentProps } from '@reach/router';
import tw from 'tailwind.macro';
import { backgroundColor, primaryTextColor, media, useMediaQueryString } from 'theme';
import styled from 'styled-components/macro';
import { primaryRoutes } from 'routing/routes';
import { Sidebar } from './Sidebar';

export const Main: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    const isDesktop = useMediaQueryString('desktop');
    const Navigation = isDesktop ? lazy(() => import('./Navbar')) : lazy(() => import('./AppBar'));

    return (
        <Wrapper>
            <Sidebar routes={primaryRoutes} />
            <div>
                <Navigation />
                <Content>{children}</Content>
            </div>
        </Wrapper>
    );
};

const Content = styled.main`
    ${tw`mx-2 mt-2`}
    background-color: ${backgroundColor};
    color: ${primaryTextColor};
`;

const Wrapper = styled.div`
    ${tw`flex flex-col-reverse md:flex-row`}
    @supports (display: grid) {
        ${media.desktop} {
            display: grid;
            grid-template-columns: min-content 1fr;
        }
    }
`;
