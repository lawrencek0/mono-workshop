import React from 'react';
import styled from 'styled-components/macro';
import { BaseVariant } from 'theme';
import { NavItem, NavItemProps } from './NavItem';
import { sidebarBackgroundColor, sidebarColor } from './theme';
interface Props {
    routes: NavItemProps[];
}

export const PrimarySidebar: React.FC<Props> = ({ routes }) => {
    return (
        <StyledNav variant="primary">
            <StyledLinks>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} variant="primary" />
                ))}
            </StyledLinks>
        </StyledNav>
    );
};

const StyledLinks = styled.ul.attrs(() => ({
    className: 'flex justify-around flex-column-l list mv0 pl0 ma0-l h-100-l',
}))`
    position: sticky;
    top: 0;
`;

const StyledNav = styled.nav.attrs(() => ({
    className: 'fixed bottom-0 w-100 static-l h-100-l',
}))<{ variant: BaseVariant }>`
    background-color: ${sidebarBackgroundColor};
    color: ${sidebarColor};
`;
