import React from 'react';
import { Link, Match } from '@reach/router';
import { IconType } from 'react-icons/lib/cjs';
import styled from 'styled-components/macro';
import { primaryTextColor, secondaryTextColor, primaryColor, media } from 'theme';

export type NavItemProps = {
    title?: string;
    to: string;
    Icon: IconType | React.FC<{}>;
    isSecondary?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ title, to, Icon, isSecondary = false }) => {
    const StyledIcon = styled(Icon)`
        font-size: 2em;
    `;

    return (
        <StyledList isSecondary={isSecondary}>
            <Match path={to}>
                {({ match }) => (
                    <StyledLink to={to} className={match ? 'active' : ''}>
                        <StyledIcon />
                        {title}
                    </StyledLink>
                )}
            </Match>
        </StyledList>
    );
};

const StyledLink = styled(Link).attrs(props => ({
    className: `${props.className} flex flex-column items-center no-underline`,
}))<{ className?: string }>`
    background-color: ${primaryColor};
    color: ${secondaryTextColor};

    &.active {
        color: ${primaryTextColor};
    }
`;

const StyledList = styled.li.attrs(() => ({
    className: 'mt2-l mb3-l',
}))<{ isSecondary: boolean }>`
    display: ${props => props.isSecondary && 'none'};

    ${media.desktop} {
        margin-top: ${props => props.isSecondary && 'auto'};
        display: initial;
    }
`;

export { NavItem };
