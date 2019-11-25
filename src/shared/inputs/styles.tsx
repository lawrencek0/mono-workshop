import styled, { css } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import { Link } from '@reach/router';
import { Wrapper, Title } from 'shared/cards/styles';
import { primaryBtnStyles, flatBtnStyles } from 'shared/buttons';

export type Variant = 'default' | 'danger' | 'disabled';

const textColor = theme('variant', {
    default: tw`text-gray-700`,
    danger: tw`text-red-500`,
});

const focusStyles = theme('variant', {
    default: tw`border focus:outline-none focus:shadow-outline`,
    danger: tw`border-2 border-red-500 focus:shadow-outline focus:border-red-700`,
});

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
    ${tw`font-medium text-lg mb-2 text-gray-700`}
    ${textColor}
`;

const StyledCheckboxLabel = styled(StyledLabel)`
    ${tw`ml-2`}
`;

const StyledInput = styled.input<{ variant?: Variant }>`
    ${tw`shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight`}
    ${focusStyles}
`;

const ButtonWrapper = styled(InputWrapper)`
    ${tw`mt-6`}
`;

const StyledLink = styled(Link)`
    ${tw`border border-primary-400 py-2 px-4 rounded cursor-pointer
        hover:bg-primary-400 focus:outline-none focus:shadow-outline`}
`;

const InputErrorMsg = styled.p`
    ${tw`pt-1 text-xs`}
    ${textColor}
`;

const Icon = styled.div`
    ${tw`inline mr-1`}
`;

// @TODO: refactor it to share proper styles with variants and not mode
const submitBtnStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${primaryBtnStyles}
            ${tw`font-bold cursor-pointer`}
        `,
    },
    disabled: {
        light: css`
            ${flatBtnStyles};
        `,
    },
});

const StyledSubmitBtn = styled.input<{ variant?: Variant }>`
    ${submitBtnStyles};
    ${tw`w-full uppercase`}
`;

StyledSubmitBtn.defaultProps = {
    variant: 'default',
};

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
    InputErrorMsg,
    Icon,
};
