import styled, { css } from 'styled-components/macro';
import tw from 'tailwind.macro';
import theme from 'styled-theming';

const sharedBtnStyles = css`
    ${tw`py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-outline`}
`;

const primaryBtnStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedBtnStyles}
            ${tw`bg-primary-400 hover:bg-primary-500`}
        `,
    },
    danger: {
        light: css`
            ${sharedBtnStyles}
            ${tw`bg-red-400 hover:bg-red-500`}
        `,
    },
});

const PrimaryButton = styled.button<{ variant?: 'default' | 'danger' }>`
    ${primaryBtnStyles}
`;

PrimaryButton.defaultProps = {
    variant: 'default',
};

const flatBtnStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedBtnStyles}
            ${tw`bg-transparent hover:bg-gray-200 font-light`}
        `,
    },
    disabled: {
        light: css`
            ${sharedBtnStyles}
            ${tw`bg-gray-400 hover:bg-gray-400 opacity-50 text-gray-800 focus:shadow-none cursor-not-allowed font-light`}
        `,
    },
});

const FlatButton = styled.button<{ variant?: 'default' | 'disabled' }>`
    ${flatBtnStyles}
`;

FlatButton.defaultProps = {
    variant: 'default',
};

export { PrimaryButton, FlatButton, sharedBtnStyles, primaryBtnStyles, flatBtnStyles };
