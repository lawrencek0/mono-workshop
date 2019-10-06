import React, { ReactNode, lazy } from 'react';
import { RouteComponentProps } from '@reach/router';
import tw from 'tailwind.macro';
import { backgroundColor, primaryTextColor, media } from 'theme';
import styled from 'styled-components/macro';
import { primaryRoutes } from 'routing/routes';
import { Sidebar } from './Sidebar';
import { AppBar } from './AppBar';

export const Main: React.FC<{ children?: ReactNode } & RouteComponentProps> = ({ children }) => {
    return (
        <Wrapper>
            <Sidebar routes={primaryRoutes} />
            <div>
                <AppBar />
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
            grid-gap: 1rem;
        }
    }
`;
