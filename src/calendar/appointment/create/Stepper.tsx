import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { primaryTextColor } from 'theme';

type Props = {
    title: string;
    steps: string[];
    activeStep: number;
    className?: string;
};

const Wrapper = styled.div<Pick<Props, 'className'>>`
    ${tw`flex flex-col items-center text-xl`}
`;

const Title = styled.h1`
    ${tw`text-2xl text-center mb-6`}
`;

const StyledSteps = styled.ol`
    ${tw`list-none`}
    counter-reset: stepCount;
`;

const UnSelectedStep = styled.li`
    ${tw`relative overflow-hidden pl-16 pb-12`}
    line-height: 2em;

    &::before {
        ${tw`absolute border-2 border-gray-400 border-0 border-l-2`}
        content: '';
        top: 2em;
        left: 1em;
        width: 3em;
        height: 20em;
    }

    &:last-of-type::before {
        ${tw`border-0 h-0`}
    }

    &::after {
        ${tw`bg-transparent rounded-full border-2 border-primary-400 text-gray-700 text-center inset-0 absolute`}
        counter-increment: stepCount;
        content: counter(stepCount);
        width: 2em;
        height: 2em;
        line-height: 2em;
    }
`;

const ActiveStep = styled(UnSelectedStep)`
    ${tw`font-bold`}

    &::after {
        ${tw`bg-primary-400`}
    }
`;

const SelectedStep = styled(UnSelectedStep)`
    &::after {
        ${tw`bg-primary-400 text-transparent`}
        content: '️✔️';
        text-shadow: 0 0 ${primaryTextColor};
    }
`;

const Stepper: React.FC<Props> = ({ title, steps, activeStep, className }) => {
    return (
        <Wrapper className={className}>
            <Title>{title}</Title>
            <StyledSteps>
                {steps.map((step, i) => {
                    if (i < activeStep - 1) {
                        return <SelectedStep key={step}>{step}</SelectedStep>;
                    }
                    if (i === activeStep - 1) {
                        return <ActiveStep key={step}>{step}</ActiveStep>;
                    }
                    return <UnSelectedStep key={step}>{step}</UnSelectedStep>;
                })}
            </StyledSteps>
        </Wrapper>
    );
};

export { Stepper };
