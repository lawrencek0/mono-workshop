import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useField } from 'formik';
import { FaUserCircle } from 'react-icons/fa';
import { FormTitle, InputWrapper, StyledCheckboxLabel as CheckboxLabel } from 'shared/inputs/styles';
import { Field } from 'shared/inputs/Field';
import { ErrorMessage } from 'shared/inputs/ErrorMessage';
import { UserResource } from 'resources/UserResource';

type Props = {
    students: Required<InstanceType<typeof UserResource>>[];
};

const StudentSelection: React.FC<Props> = ({ students }) => {
    const [field] = useField('students');

    return (
        <>
            <FormTitle>Select Students</FormTitle>
            <ErrorMessage name="students" />
            <Field
                type="text"
                id="search"
                name="search"
                disabled={true}
                label="Search Students"
                placeholder="Search Students with ElasticSearch (Coming Soon)"
            />
            <InputWrapper>
                <StyledList>
                    {students.map(({ id, firstName, lastName, picUrl }, i) => (
                        <StyledListItem key={id} border={i !== students.length - 1}>
                            <input
                                {...field}
                                type="checkbox"
                                name="students"
                                value={id.toString()}
                                id={`student-${id}`}
                                checked={field.value.includes(id.toString())}
                            />
                            <StyledCheckboxLabel htmlFor={`student-${id}`}>
                                <div css={tw`mx-4`}>
                                    {picUrl ? <Avatar src={picUrl} /> : <FaUserCircle size="3em" />}
                                </div>
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
        </>
    );
};

const Avatar = styled.img`
    ${tw`rounded-full inline-block`}
    width: 3em;
    height: 3em;
`;

const StyledList = styled.ul`
    ${tw`list-none`}
`;

const StyledListItem = styled.li<{ border: boolean }>`
    ${tw`flex items-center  border-gray-400 px-4 py-2 mt-2`}
    border-bottom-width: ${props => props.border && '1px'}
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

export { Avatar, StudentSelection };
