import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Link } from '@reach/router';

const Wrapper = styled.div`
    ${tw`flex flex-col justify-between py-4 px-8 mb-4 leading-normal shadow-md
        rounded`}
    background: var(--color-bg-card);
`;

const Title = styled.h1`
    ${tw`font-medium text-lg mb-2`}
`;

const Body = styled.div`
    ${tw`text-gray-700 text-sm`}
`;

const Footer = styled.div`
    ${tw`mt-4 uppercase tracking-wide text-base text-gray-600`}
`;

const StyledLink = styled(Link)`
    ${tw`border-gray-400 border-2 hover:bg-gray-200 py-2 px-4`}
`;

export { Wrapper, Title, Body, Footer, StyledLink };
