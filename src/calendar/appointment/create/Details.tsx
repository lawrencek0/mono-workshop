import React from 'react';
import { Detail } from 'calendar/types';
import {
    FormWrapper,
    FormTitle,
    StyledLabel,
    StyledInput,
    ButtonWrapper,
    InputWrapper,
    StyledLink,
} from 'shared/inputs';

type Props = Detail & {
    onInputChange: (name: 'title' | 'description', value: string) => void;
};

const Details: React.FC<Props> = ({ title, description, onInputChange }) => {
    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement | HTMLTextAreaElement }): void => {
        onInputChange(currentTarget.name as 'title' | 'description', currentTarget.value);
    };

    return (
        <FormWrapper>
            <FormTitle>Fill Appointment Details</FormTitle>
            <InputWrapper>
                <StyledLabel htmlFor="title">Title</StyledLabel>
                <StyledInput type="title" name="title" id="title" value={title} onChange={handleInputChange} />
            </InputWrapper>
            <InputWrapper>
                <StyledLabel htmlFor="description">Description</StyledLabel>
                <StyledInput
                    as="textarea"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleInputChange}
                />
            </InputWrapper>
            <ButtonWrapper>
                <StyledLink to="../2">Next</StyledLink>
            </ButtonWrapper>
        </FormWrapper>
    );
};

export { Details };
