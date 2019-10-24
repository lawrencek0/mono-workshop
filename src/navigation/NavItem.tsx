import React from 'react';
import { Link, Match } from '@reach/router';
import { IconType } from 'react-icons/lib/cjs';
import styled, { css } from 'styled-components/macro';
import tw from 'tailwind.macro';
import { RouteTitles } from 'routing/routes';
import { media, useMediaQueryString } from 'theme';
import theme from 'styled-theming';

export type Variant = 'active' | 'inactive';

export type NavItemProps = {
    title: RouteTitles;
    to: string;
    Icon: IconType | React.FC<{}>;
    variant?: Variant;
    isSecondary?: boolean;
    isHome?: boolean;
};

export const NavItem: React.FC<NavItemProps> = ({ title, to, Icon, isSecondary = false, isHome = false }) => {
    const isDesktop = useMediaQueryString('desktop');
    const StyledIcon = styled(Icon)`
        ${tw`text-4xl`}
    `;

    return (
        <StyledListItem
            isSecondary={isSecondary}
            css={`
                ${isHome && tw`lg:mb-auto`}
            `}
        >
            <Match path={to}>
                {({ match }) => (
                    <StyledLink to={to} variant={match ? 'active' : 'inactive'}>
                        <StyledIcon aria-label={title} />
                        {!isDesktop && title}
                    </StyledLink>
                )}
            </Match>
        </StyledListItem>
    );
};

const navLinkStyles = theme.variants('mode', 'variant', {
    inactive: {
        light: css`
            ${tw`hover:bg-primary-100`}
        `,
        dark: css`
            ${tw`bg-transparent text-gray-500 hover:bg-gray-700`}
        `,
    },
    active: {
        light: css`
            ${tw`bg-primary-200 text-gray-800`}
        `,
        dark: css`
            ${tw`bg-gray-600 text-white`}
        `,
    },
});

const StyledLink = styled(Link)<{ variant: Variant }>`
    ${tw`flex flex-col items-center py-2 px-6`}
    ${navLinkStyles};
`;

const StyledListItem = styled.li<{ isSecondary: boolean; css: string }>`
    ${tw`md:mt-2 md:mb-4`}
    display: ${props => props.isSecondary && 'none'};

    ${media.desktop} {
        display: initial;
        margin-top: ${props => props.isSecondary && 'auto'};
    }
`;
