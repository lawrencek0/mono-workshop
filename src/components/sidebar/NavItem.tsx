import React from 'react';
import { Link, Match } from '@reach/router';
import { IconType } from 'react-icons/lib/cjs';
import styled from 'styled-components/macro';
import { navItemStyles, BaseVariant } from './theme';

type Variant = BaseVariant | 'active';

export type NavItemProps = {
    title?: string;
    to: string;
    Icon: IconType | React.FC<{}>;
    variant?: Variant;
};

export const NavItem: React.FC<NavItemProps> = ({ title, to, Icon, variant = 'primary' }) => {
    const StyledIcon = styled(Icon).attrs(() => ({
        className: 'f2',
    }))``;

    return (
        <StyledList>
            <Match path={to}>
                {({ match }) => (
                    <StyledLink to={to} variant={match ? 'active' : variant}>
                        <StyledIcon />
                        {title}
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
}))``;
