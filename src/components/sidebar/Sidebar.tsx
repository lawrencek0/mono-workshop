import React from 'react';
import styled from 'styled-components/macro';
import { BaseVariant } from 'theme';
import { NavItem, NavItemProps } from './NavItem';
import { sidebarBackgroundColor, sidebarColor } from './theme';
interface Props {
    routes: NavItemProps[];
    variant: BaseVariant;
}

export const Sidebar: React.FC<Props> = ({ routes, variant }) => {
    return (
        <StyledNav variant={variant}>
            <StyledLinks>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} variant={variant} />
                ))}
            </StyledLinks>
        </StyledNav>
    );
};

const StyledLinks = styled.ul.attrs(() => ({
    className: 'flex justify-around flex-column-l list pl0 ma0-l h-100-l',
}))`
    position: sticky;
    top: 0;
`;

const StyledNav = styled.nav.attrs(() => ({
    className: 'h-100-l',
}))<{ variant: BaseVariant }>`
    background-color: ${sidebarBackgroundColor};
    color: ${sidebarColor};
`;
