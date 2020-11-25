import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { FaCaretDown } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { Menu, MenuList, MenuButton, MenuLink } from '@reach/menu-button';
import { useAuthState } from 'auth/hooks';
import { Link } from '@reach/router';
import '@reach/menu-button/styles.css';

const Navbar: React.FC = () => {
    const {
        user: { firstName, lastName, picUrl },
    } = useAuthState();

    return (
        <StyledHeader>
            <Menu>
                <Avatar>
                    {picUrl ? (
                        <img alt={`${firstName} ${lastName}`} css={tw`w-12 h-12 rounded-full`} src={picUrl} />
                    ) : (
                        <FaUserCircle css={tw`w-12 h-12`} />
                    )}
                    <div css={tw`ml-2`}>
                        {firstName} {lastName}
                    </div>
                    <StyledIcon as={FaCaretDown} aria-hidden css={tw`ml-2`} />
                </Avatar>
                <StyledMenuList>
                    <MenuLink as={(Link as unknown) as string} to="/logout">
                        Logout
                    </MenuLink>
                </StyledMenuList>
            </Menu>
        </StyledHeader>
    );
};

export const StyledMenuList = styled(MenuList)`
    &[data-reach-menu-list] {
        ${tw`border-gray-400 shadow-lg`}
        background: var(--color-bg-card);
    }
    & [data-reach-menu-item] {
        ${tw`text-lg`}
    }
    & [data-reach-menu-item][data-selected] {
        ${tw`bg-primary-400`}
    }
`;

const Avatar = styled(MenuButton)`
    ${tw`flex ml-auto items-center content-between text-xl mx-2`}
`;

const StyledHeader = styled.header`
    ${tw`flex items-center text-2xl shadow pt-2 pb-4`}
    background: var(--color-bg-card);

    & [data-reach-menu-button] {
        ${tw`ml-auto`}
    }
`;

const StyledIcon = styled.div<{ css?: string }>`
    ${tw`text-3xl text-gray-600`}
`;

export default Navbar;
