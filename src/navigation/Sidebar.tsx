import React from 'react';
import styled from 'styled-components/macro';
import { BaseVariant } from 'theme';
import { NavItem } from './NavItem';
import { sidebarBackgroundColor, sidebarColor } from './theme';
import { Route } from 'routing/routes';

interface Props {
    routes: readonly Route[];
}

const PrimarySidebar: React.FC<Props> = ({ routes }) => {
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

const SecondarySidebar: React.FC<Props> = ({ routes }) => {
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

const StyledLinks = styled.ul.attrs(() => ({
    className: 'flex justify-around justify-start-l flex-column-l list mv0 pl0 ma0-l min-vh-100-l',
}))`
    position: sticky;
    top: 0;
`;

const StyledNav = styled.nav.attrs(() => ({
    className: 'min-vh-100-l',
}))<{ variant: BaseVariant }>`
    background-color: ${sidebarBackgroundColor};
    color: ${sidebarColor};
`;

const StyledPrimaryNav = styled(StyledNav).attrs(() => ({
    className: 'fixed bottom-0 mw-100 mw-none-l static-l',
}))``;

const StyledSecondaryLinks = styled(StyledLinks).attrs(props => ({
    className: `${props.className} justify-end-l`,
}))``;

export { PrimarySidebar, SecondarySidebar as default, StyledLinks, StyledNav };
