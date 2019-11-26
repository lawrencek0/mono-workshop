import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { primaryTextColor } from 'themes/theme';
import { MdMenu } from 'react-icons/md';
import { Link } from '@reach/router';

const AppBar: React.FC<{}> = () => {
    return (
        <Header>
            <Title>Team Yellow</Title>
            <Menu />
        </Header>
    );
};

const Menu: React.FC<{}> = () => {
    return (
        <StyledLink to="/settings">
            <StyledIcon />
        </StyledLink>
    );
};

const StyledLink = styled(Link)`
    ${tw`ml-auto`}
    color: ${primaryTextColor};
`;

const StyledIcon = styled(MdMenu)`
    ${tw`text-4xl`}
`;

const Header = styled.header`
    ${tw`flex items-center px-2 py-4 text-2xl`}
    background: var(--color-bg-primary-navbar);
    color: ${primaryTextColor};
`;

const Title = styled.h1`
    ${tw`text-3xl`}
`;

export default AppBar;
