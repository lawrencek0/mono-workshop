import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { Link } from '@reach/router';
import { Wrapper, Title } from './cards/styles';

const FormWrapper = styled(Wrapper)`
    ${tw`w-full lg:w-2/3 m-auto my-4 text-xl`}
`;

const FormTitle = styled(Title)`
    ${tw`text-2xl text-center mb-4`}
`;

const InputWrapper = styled.div`
    ${tw`mb-4`}
`;

const StyledLabel = styled.label`
    ${tw`text-gray-700 font-medium text-lg mb-2`}
`;

const StyledCheckboxLabel = styled(StyledLabel)`
    ${tw`ml-2`}
`;

const StyledInput = styled.input`
    ${tw`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
        focus:outline-none focus:shadow-outline`}
`;

const ButtonWrapper = styled(InputWrapper)`
    ${tw`mt-6`}
`;

const StyledLink = styled(Link)`
    ${tw`border border-primary-400 py-2 px-4 rounded cursor-pointer
        hover:bg-primary-400 focus:outline-none focus:shadow-outline`}
`;

const StyledSubmitBtn = styled.input`
    ${tw`bg-primary-400 hover:bg-primary-500 w-full font-bold py-2 px-4 rounded uppercase
        focus:outline-none focus:shadow-outline cursor-pointer`}
`;

export {
    FormWrapper,
    FormTitle,
    InputWrapper,
    StyledLabel,
    StyledCheckboxLabel,
    StyledInput,
    ButtonWrapper,
    StyledLink,
    StyledSubmitBtn,
};
