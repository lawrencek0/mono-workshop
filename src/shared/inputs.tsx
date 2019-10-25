import React from 'react';
import { FieldProps, ErrorMessage } from 'formik';
import styled, { css } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import { Link } from '@reach/router';
import { MdInfo } from 'react-icons/md';
import { Wrapper, Title } from './cards/styles';
import { primaryBtnStyles, flatBtnStyles } from './buttons';

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

const StyledInfo = styled(MdInfo)`
    ${tw`inline mr-1`}
`;

type SuperInputProps<T> = FieldProps<T> & {
    label: string;
    id: string;
    type: string;
};

const SuperInput: <T extends Record<string, unknown>>(
    p: SuperInputProps<T>,
) => React.ReactElement<SuperInputProps<T>> = ({ field, form: { errors, touched }, id, label, type, ...props }) => {
    const variant = errors[field.name] && touched[field.name] ? 'danger' : 'default';
    return (
        <InputWrapper>
            <StyledLabel htmlFor={id} variant={variant}>
                {label}
            </StyledLabel>
            <StyledInput type={type} variant={variant} id={id} {...field} {...props} />
            <ErrorMessage
                name={field.name}
                render={msg => (
                    <InputErrorMsg>
                        <StyledInfo />
                        {msg}
                    </InputErrorMsg>
                )}
            />
        </InputWrapper>
    );
};

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
    SuperInput,
};
