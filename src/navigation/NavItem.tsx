import React from 'react';
import { Link, Match } from '@reach/router';
import { IconType } from 'react-icons/lib/cjs';
import styled from 'styled-components/macro';
import { navItemStyles, BaseVariant } from './theme';
import { RouteTitles } from 'routing/routes';
import { media } from 'theme';

export type Variant = BaseVariant | 'active';

export type NavItemProps = {
    title: RouteTitles;
    to: string;
    Icon: IconType | React.FC<{}>;
    variant?: Variant;
    isSecondary?: boolean;
};

export const NavItem: React.FC<NavItemProps> = ({ title, to, Icon, variant = 'primary', isSecondary = false }) => {
    const StyledIcon = styled(Icon).attrs(() => ({
        className: 'f2',
    }))``;

    return (
        <StyledList isSecondary={isSecondary}>
            <Match path={to}>
                {({ match }) => (
                    <StyledLink to={to} variant={match ? 'active' : variant}>
                        <StyledIcon />
                        {variant !== 'secondary' && title}
                    </StyledLink>
                )}
            </Match>
        </StyledList>
    );
};

const StyledLink = styled(Link).attrs(() => ({
    className: 'flex flex-column items-center no-underline pv2 ph4 ph1-l',
}))<{ variant: Variant }>`
    ${navItemStyles};

    &:hover {
        transition: background-color 0.15s ease-in;
    }
`;

const StyledList = styled.li.attrs(() => ({
    className: 'mt2-l mb3-l',
}))<{ isSecondary: boolean }>`
    display: ${props => props.isSecondary && 'none'};

    ${media.desktop} {
        display: initial;
        margin-top: ${props => props.isSecondary && 'auto'};
    }
`;
