import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { FaUserCircle } from 'react-icons/fa';
import { Student } from 'calendar/types';
import {
    FormWrapper,
    FormTitle,
    InputWrapper,
    StyledInput,
    StyledLabel as Label,
    StyledLink,
    ButtonWrapper,
    StyledCheckboxLabel as CheckboxLabel,
} from 'shared/inputs';

type Props = {
    students: Student[];
    onStudentSelection: ({ currentTarget }: { currentTarget: HTMLInputElement }) => void;
    onSubmit: (event: React.MouseEvent) => void;
};

const StudentSelection: React.FC<Props> = ({ students, onStudentSelection, onSubmit }) => {
    return (
        <FormWrapper>
            <FormTitle>Select Students</FormTitle>
            <InputWrapper>
                <StyledLabel htmlFor="search">Search Students</StyledLabel>
                <StyledInput
                    type="text"
                    id="search"
                    name="search"
                    disabled={true}
                    placeholder="Search Students with ElasticSearch (Coming Soon)"
                />
            </InputWrapper>
            <InputWrapper>
                <StyledList>
                    {students.map(({ id, firstName, lastName, selected }, i) => (
                        <StyledListItem key={id} border={i !== students.length - 1}>
                            <input
                                type="checkbox"
                                name={id}
                                id={`student-${id}`}
                                onChange={onStudentSelection}
                                checked={selected || false}
                            />
                            <StyledCheckboxLabel htmlFor={`student-${id}`}>
                                <StyledAvatar size="3em" />
                                <div>
                                    <LabelTitle>
                                        {firstName} {lastName}
                                    </LabelTitle>
                                    <LabelSubtitle>Junior</LabelSubtitle>
                                </div>
                            </StyledCheckboxLabel>
                        </StyledListItem>
                    ))}
                </StyledList>
            </InputWrapper>
            <ButtonWrapper>
                <StyledLink onClick={onSubmit} to="../3">
                    Next
                </StyledLink>
            </ButtonWrapper>
        </FormWrapper>
    );
};

const StyledAvatar = styled(FaUserCircle)`
    ${tw`mr-2`}
`;

const StyledList = styled.ul`
    ${tw`list-none`}
`;

const StyledListItem = styled.li<{ border: boolean }>`
    ${tw`flex items-center  border-gray-400 px-4 py-2 mt-2`}
    border-bottom-width: ${props => props.border && '1px'}
`;

const StyledLabel = styled(Label)`
    ${tw`ml-2`}
`;

const StyledCheckboxLabel = styled(CheckboxLabel)`
    ${tw`flex`}
`;

const LabelTitle = styled.div`
    ${tw`text-lg`}
`;

const LabelSubtitle = styled.div`
    ${tw`text-base text-gray-600`}
`;

export { StudentSelection };
