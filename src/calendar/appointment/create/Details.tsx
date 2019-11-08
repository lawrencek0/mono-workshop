import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { FormTitle, StyledInput } from 'shared/inputs/styles';
import { Field } from 'shared/inputs/Field';

const Details: React.FC = () => {
    return (
        <>
            <FormTitle>Fill Appointment Details</FormTitle>
            <Field type="text" name="title" id="title" label="Title" />
            <Field as="textarea" type="text" name="description" id="description" label="Description" />
            <StyledColor type="color" name="color" id="color" label="Pick Event Color" />
        </>
    );
};

const StyledColor = styled(Field)`
    ${tw`w-1/3`}

    ${/*sc-select*/ StyledInput} {
        ${tw`h-10`}
    }
`;

export { Details };
