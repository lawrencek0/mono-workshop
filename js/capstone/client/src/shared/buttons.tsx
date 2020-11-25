import styled, { css } from 'styled-components/macro';
import tw from 'tailwind.macro';
import theme from 'styled-theming';

const sharedStyles = css`
    ${tw`py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-outline`}
`;
const disabledStyles = css`
    ${tw`opacity-50 text-gray-800 focus:shadow-none cursor-not-allowed font-light`}
`;

const primaryBtnStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedStyles}
            ${tw`bg-primary-400 hover:bg-primary-500`}
        `,
        dark: css`
            ${sharedStyles}
            ${tw`bg-primary-400 hover:bg-primary-500 text-gray-700`}
        `,
    },
    disabled: {
        light: css`
            ${sharedStyles}
            ${disabledStyles}
            ${tw`bg-primary-300 hover:bg-primary-300`}
        `,
        dark: css`
            ${sharedStyles}
            ${disabledStyles}
            ${tw`bg-primary-300 hover:bg-primary-300 text-gray-700`}
        `,
    },
    danger: {
        light: css`
            ${sharedStyles}
            ${tw`bg-red-400 hover:bg-red-500`}
        `,
        dark: css`
            ${sharedStyles}
            ${tw`bg-red-400 hover:bg-red-500`}
        `,
    },
});

const PrimaryButton = styled.button<{ variant?: 'default' | 'disabled' | 'danger' }>`
    ${primaryBtnStyles}
`;

PrimaryButton.defaultProps = {
    variant: 'default',
};

const flatBtnStyles = theme.variants('mode', 'variant', {
    default: {
        light: css`
            ${sharedStyles}
            ${tw`bg-transparent hover:bg-gray-200 font-light`}
        `,
    },
    disabled: {
        light: css`
            ${sharedStyles}
            ${disabledStyles}
            ${tw`bg-gray-400 hover:bg-gray-400`}
        `,
    },
});

const FlatButton = styled.button<{ variant?: 'default' | 'disabled' }>`
    ${flatBtnStyles}
`;

FlatButton.defaultProps = {
    variant: 'default',
};

export { PrimaryButton, FlatButton, sharedStyles as sharedBtnStyles, primaryBtnStyles, flatBtnStyles };
