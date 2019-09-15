import React from 'react';
import styled from 'styled-components';
import { NavItem, NavItemProps } from './NavItem';
import { primaryColor } from 'theme';

interface Props {
    routes: NavItemProps[];
}

export const Sidebar: React.FC<Props> = ({ routes }) => {
    return (
        <StyledNav>
            <StyledLinks>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} />
                ))}
            </StyledLinks>
        </StyledNav>
    );
};

const StyledLinks = styled.ul.attrs(() => ({
    className: 'flex justify-around flex-column-l list pl0 ma0-l mh1-l h-100-l',
}))`
    position: sticky;
    top: 0;
`;

const StyledNav = styled.nav.attrs(() => ({
    className: 'h-100-l',
}))`
    background-color: ${primaryColor};
`;
