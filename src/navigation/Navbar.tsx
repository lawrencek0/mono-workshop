import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { MdSearch, MdNotifications } from 'react-icons/md';
import { useAuthState } from 'auth/hooks';

const Navbar: React.FC<{}> = () => {
    const { firstName } = useAuthState();

    return (
        <StyledHeader>
            <SearchWrapper>
                <StyledIcon as={MdSearch} />
                <StyledSearch disabled={false} placeholder="Search" />
            </SearchWrapper>
            <StyledIcon as={MdNotifications} css={tw`ml-auto`} />
            <AvatarWrapper>{firstName}</AvatarWrapper>
        </StyledHeader>
    );
};

const AvatarWrapper = styled.div`
    ${tw`ml-16 mr-8 text-gray-800`}
`;

const StyledHeader = styled.header`
    ${tw`flex items-center text-2xl border-gray-200 border-b-2 pt-2 pb-4`}
`;

const StyledIcon = styled.div<{ css?: string }>`
    ${tw`text-3xl text-gray-600`}
`;

const SearchWrapper = styled.div`
    ${tw`flex items-center w-9/12 ml-8`}
`;

const StyledSearch = styled.input`
    ${tw`bg-white focus:outline-none border-none
        py-2 px-4 block appearance-none leading-tight`}
`;

export default Navbar;
