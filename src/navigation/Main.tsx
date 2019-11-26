import React, { ReactNode, lazy } from 'react';
import { RouteComponentProps } from '@reach/router';
import tw from 'tailwind.macro';
import { media, useMediaQueryString } from 'themes/theme';
import styled from 'styled-components/macro';
import { primaryRoutes } from 'routing/routes';
import { Sidebar } from './Sidebar';

export const Main: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    const isDesktop = useMediaQueryString('desktop');
    const Navigation = isDesktop ? lazy(() => import('./Navbar')) : lazy(() => import('./AppBar'));

    return (
        <Wrapper>
            <Sidebar routes={primaryRoutes} />
            <ContentWrapper>
                <Navigation />
                <Content>{children}</Content>
            </ContentWrapper>
        </Wrapper>
    );
};

const Content = styled.main`
    ${tw`mx-2 h-full`}
`;

const ContentWrapper = styled.div`
    ${tw`w-full`}
    @supports (display: grid) {
        display: grid;
        grid-template-rows: minmax(min-content, 75px) 1fr;
        grid-gap: 1em;
    }
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
