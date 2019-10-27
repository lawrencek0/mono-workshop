import React from 'react';
import styled, { css, ThemeProvider } from 'styled-components/macro';
import tw from 'tailwind.macro';
import theme from 'styled-theming';

type Direction = 'vertical' | 'horizontal';

type Props = Readonly<{
    title: string;
    steps: Readonly<string[]>;
    activeStep: number;
    direction: Direction;
    goToPage: (page: number) => void;
}>;

const Stepper: React.FC<Props> = ({ title, steps, activeStep, direction, goToPage: handleClick }) => {
    return (
        <ThemeProvider theme={{ direction }}>
            <Wrapper>
                <Title>{title}</Title>
                <StyledSteps>
                    {steps.map((step, i) => {
                        const type = i < activeStep - 1 ? 'selected' : i === activeStep - 1 ? 'active' : 'unselected';
                        return (
                            <ThemeProvider key={step} theme={{ type }}>
                                <Step>
                                    <ConnectorWrapper onClick={() => handleClick(i + 1)}>
                                        <Connector></Connector>
                                        <Text>{step}</Text>
                                    </ConnectorWrapper>
                                </Step>
                            </ThemeProvider>
                        );
                    })}
                </StyledSteps>
            </Wrapper>
        </ThemeProvider>
    );
};

const displayStyles = theme('direction', {
    horizontal: css`
        ${tw`inline`}
    `,
    vertical: css`
        ${tw`flex`}
    `,
});

const fontStyles = theme('type', {
    selected: css`
        ${tw`font-normal`}
    `,
    active: css`
        ${tw`font-semibold`}
    `,
    unselected: css`
        ${tw`font-light`}
    `,
});

const ConnectorWrapper = styled.button`
    ${tw`w-full`}
    ${fontStyles}
    ${displayStyles}
`;

const Title = styled.h1`
    ${tw`text-2xl text-center mb-6`}
`;

const stepsStyles = theme('direction', {
    horizontal: css`
        ${tw`flex-row w-11/12`}
    `,
    vertical: css`
        ${tw`flex-col m-auto`}
    `,
});

const StyledSteps = styled.ol`
    ${tw`flex list-none`}
    ${stepsStyles}
    counter-reset: stepCount;
`;

/**
 * `calc` is used to make sure the line is properly positioned.
 * The width of the circle is `2em` so by adding the half to 50% of the left, the line starts from the end of circle.
 * `w-1` is `0.25em` so it's divided in half in order to center from its point of origin.
 */
const connectorLineStyles = theme('direction', {
    horizontal: css`
        ${tw`w-full h-1`}
        left: calc(50% + 1em);
        top: 1em;
    `,
    vertical: css`
        ${tw`w-1 h-full`}
        left: calc(1em - 0.125em);
    `,
});

const connectorStyles = theme('type', {
    selected: css`
        &::before {
            ${tw`bg-primary-400 border-primary-400`}
            content: '️✔️';
        }
        &::after {
            ${tw`bg-primary-400`}
        }
    `,
});

const Connector = styled.div`
    ${tw`relative`}

    &::before {
        ${tw`mx-auto block rounded-full border-2 border-gray-400 text-gray-700 text-center z-10 w-8 h-8`}
        background-color: #f9f9f9;
        counter-increment: stepCount;
        content: counter(stepCount);
        line-height: 2em;
    }
    &::after {
        ${tw`block bg-gray-400 absolute`}
        ${connectorLineStyles}
        content: '';
    }

    ${connectorStyles}
`;

const Step = styled.li`
    ${tw`flex-1`}

    &:last-of-type ${/*sc-select*/ Connector}::after {
        content: none
    }
`;

const textStyles = theme('direction', {
    horizontal: css`
        ${tw`px-2 py-4`}
    `,
    vertical: css`
        ${tw`px-4 pb-12 pt-1`}
    `,
});

const Text = styled.div`
    ${tw`text-center hover:underline`};
    ${textStyles}
`;

const Wrapper = styled.div`
    ${tw`flex flex-col items-center w-full`}
`;

export { Stepper };
