import React from 'react';
import styled from 'styled-components/macro';
import { BaseVariant } from 'theme';
import { NavItem } from './NavItem';
import { sidebarBackgroundColor, sidebarColor } from './theme';
import { Route } from 'routes';
interface Props {
    routes: readonly Route[];
}

export const PrimarySidebar: React.FC<Props> = ({ routes }) => {
    return (
        <StyledPrimaryNav variant="primary">
            <StyledLinks>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} variant="primary" />
                ))}
            </StyledLinks>
        </StyledPrimaryNav>
    );
};

export const SecondarySidebar: React.FC<Props> = ({ routes }) => {
    return (
        <StyledNav variant="secondary">
            <StyledSecondaryLinks>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} variant="secondary" />
                ))}
            </StyledSecondaryLinks>
        </StyledNav>
    );
};

export const StyledLinks = styled.ul.attrs(() => ({
    className: 'flex justify-around justify-start-l flex-column-l list mv0 pl0 ma0-l h-100-l',
}))`
    position: sticky;
    top: 0;
`;

export const StyledNav = styled.nav.attrs(() => ({
    className: 'h-100-l',
}))<{ variant: BaseVariant }>`
    background-color: ${sidebarBackgroundColor};
    color: ${sidebarColor};
`;

const StyledPrimaryNav = styled(StyledNav).attrs(() => ({
    className: 'fixed bottom-0 w-100 static-l',
}))``;

const StyledSecondaryLinks = styled(StyledLinks).attrs(props => ({
    className: `${props.className} justify-end-l`,
}))``;
