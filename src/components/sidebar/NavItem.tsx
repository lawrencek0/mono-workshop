import React from 'react';
import { Link, Match } from '@reach/router';
import { IconType } from 'react-icons/lib/cjs';
import styled from 'styled-components/macro';
import { navItemStyles, media, BaseVariant } from './theme';

type Variant = BaseVariant | 'active';

export type NavItemProps = {
    title?: string;
    to: string;
    Icon: IconType | React.FC<{}>;
    isSecondary?: boolean;
    variant?: Variant;
};

const NavItem: React.FC<NavItemProps> = ({ title, to, Icon, isSecondary = false, variant = 'primary' }) => {
    const StyledIcon = styled(Icon)`
        font-size: 2em;
    `;

    return (
        <StyledList isSecondary={isSecondary}>
            <Match path={to}>
                {({ match }) => (
                    <StyledLink to={to} className={match ? 'active' : ''} variant={match ? 'active' : variant}>
                        <StyledIcon />
                        {title}
                    </StyledLink>
                )}
            </Match>
        </StyledList>
    );
};

const StyledLink = styled(Link).attrs(props => ({
    className: `${props.className} flex flex-column items-center no-underline ph1-l`,
}))<{ className?: string; variant: Variant }>`
    ${navItemStyles};
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
