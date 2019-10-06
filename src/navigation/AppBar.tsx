import React from 'react';
import styled from 'styled-components';
import { BaseVariant, primaryTextColor } from 'theme';
import { MdMenu } from 'react-icons/md';
import { Link } from '@reach/router';

const AppBar: React.FC<{}> = () => {
    return (
        <Header variant="primary">
            <h1 className="f4">Team Yellow</h1>
            <Menu />
        </Header>
    );
};

const Menu: React.FC<{}> = () => {
    return (
        <StyledLink to="/menu">
            <StyledIcon />
        </StyledLink>
    );
};

const StyledLink = styled(Link).attrs(() => ({
    className: 'ml-auto',
}))`
    color: ${primaryTextColor};
`;

const StyledIcon = styled(MdMenu).attrs(() => ({
    className: 'f2',
}))``;

const Header = styled.header.attrs(() => ({
    className: 'flex items-center ph2 f4',
}))<{ variant: Extract<BaseVariant, 'primary'> }>`
    color: ${primaryTextColor};
`;

export { AppBar };
