import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { FaFolderOpen } from 'react-icons/fa';

export const EmptyMessage: React.FC<{
    className?: string;
    children: React.ReactChild;
}> = ({ className, children }) => {
    return (
        <Wrapper className={className}>
            <FaFolderOpen size="2em" />
            <Content>{children}</Content>
        </Wrapper>
    );
};

const Content = styled.div`
    ${tw`text-xl`}
`;

const Wrapper = styled.div`
    ${tw`flex flex-col items-center opacity-50`}
`;
