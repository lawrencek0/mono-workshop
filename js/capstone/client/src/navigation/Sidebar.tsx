import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'tailwind.macro';
import { NavItem } from './NavItem';
import { Route } from 'routing/routes';
import theme from 'styled-theming';

interface Props {
    routes: readonly Route[];
}

const Sidebar: React.FC<Props> = ({ routes }) => {
    return (
        <StyledNav>
            <StyledList>
                {routes.map((route, i) => (
                    <NavItem key={i} {...route} />
                ))}
            </StyledList>
        </StyledNav>
    );
};

const navStyles = theme('mode', {
    light: css`
        ${tw`shadow-md text-gray-900`}
        background: var(--color-bg-primary-navbar);
    `,
    dark: css`
        ${tw`bg-dark-4`}
    `,
});

const StyledList = styled.ul`
    ${tw`sticky top-0 flex justify-around list-none lg:justify-start lg:flex-col lg:min-h-screen`}
`;

const StyledNav = styled.nav`
    ${tw`w-full lg:w-auto fixed bottom-0 lg:static`}
    ${navStyles}
`;

export { Sidebar, StyledList, StyledNav };
