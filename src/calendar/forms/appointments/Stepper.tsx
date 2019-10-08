import React from 'react';
import styled from 'styled-components/macro';
import { primaryColor, primaryTextColor, dayColors } from 'theme';

type Props = {
    steps: string[];
    activeStep: number;
    className?: string;
};

const StyledSteps = styled.ol<{ className?: string }>`
    list-style: none;
    counter-reset: stepCount;
`;

const UnSelectedStep = styled.li`
    position: relative;
    overflow: hidden;
    padding-left: 3em;
    padding-bottom: 2em;
    line-height: 2em;

    &::before {
        content: '';
        position: absolute;
        top: 2em;
        left: 1em;
        width: 3em;
        height: 20em;
        border: 2px solid ${dayColors.grey};
        border-width: 0px 0 0 2px;
    }

    &:last-of-type::before {
        border-width: 0;
    }

    &::after {
        background-color: transparent;
        border-radius: 50%;
        border: 1px solid ${primaryColor};
        color: ${primaryTextColor};
        counter-increment: stepCount;
        content: counter(stepCount);
        position: absolute;
        top: 0;
        left: 0;
        width: 2em;
        height: 2em;
        line-height: 2em;
        text-align: center;
    }
`;

const ActiveStep = styled(UnSelectedStep)`
    font-weight: bold;

    &::after {
        background-color: ${primaryColor};
    }
`;

const SelectedStep = styled(UnSelectedStep)`
    &::before {
        border-color: ${primaryColor};
    }
    &::after {
        content: '️✔️';
        color: transparent;
        text-shadow: 0 0 ${primaryTextColor};
        background-color: ${primaryColor};
    }
`;

const Stepper: React.FC<Props> = ({ steps, activeStep, className }) => {
    return (
        <StyledSteps className={className}>
            {steps.map((step, i) => {
                if (i < activeStep - 1) {
                    return <SelectedStep key={i}>{step}</SelectedStep>;
                }
                if (i === activeStep - 1) {
                    return <ActiveStep key={i}>{step}</ActiveStep>;
                }
                return <UnSelectedStep key={i}>{step}</UnSelectedStep>;
            })}
        </StyledSteps>
    );
};

export { Stepper };
