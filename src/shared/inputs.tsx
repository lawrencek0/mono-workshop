import styled, { css } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import { Link } from '@reach/router';
import { Wrapper, Title } from './cards/styles';
import { primaryBtnStyles, sharedBtnStyles, flatBtnStyles } from './buttons';

export type Variant = 'default' | 'danger' | 'disabled';

const FormWrapper = styled(Wrapper)`
    ${tw`w-full lg:w-2/3 m-auto my-4 text-xl`}
`;

const FormTitle = styled(Title)`
    ${tw`text-2xl text-center mb-4`}
`;

const InputWrapper = styled.div`
    ${tw`mb-4`}
`;

const sharedLabelStyles = css`
    ${tw`text-gray-700 font-medium text-lg mb-2`}
`;

const labelStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedLabelStyles}
        `,
    },
    danger: {
        light: css`
            ${sharedLabelStyles}
            ${tw`text-red-500`}
        `,
    },
});

const StyledLabel = styled.label<{ variant?: Variant }>`
    ${labelStyles}
`;

const StyledCheckboxLabel = styled(StyledLabel)`
    ${tw`ml-2`}
`;

const sharedInputStyles = css`
    ${tw`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
        focus:outline-none focus:shadow-outline`}
`;

const inputStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedInputStyles}
        `,
    },
    danger: {
        light: css`
            ${sharedInputStyles}
            ${tw`border-2 border-red-500 focus:border-red-700`}
        `,
    },
});

const StyledInput = styled.input<{ variant?: Variant }>`
    ${inputStyles}
`;

const ButtonWrapper = styled(InputWrapper)`
    ${tw`mt-6`}
`;

const StyledLink = styled(Link)`
    ${tw`border border-primary-400 py-2 px-4 rounded cursor-pointer
        hover:bg-primary-400 focus:outline-none focus:shadow-outline`}
`;

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

const InputErrorMsg = styled.p`
    ${tw`text-red-500 pt-1 text-xs`}
`;

StyledLabel.defaultProps = {
    variant: 'default',
};

StyledInput.defaultProps = {
    variant: 'default',
};

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
};
