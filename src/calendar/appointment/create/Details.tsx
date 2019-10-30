import React from 'react';
import { FormTitle } from 'shared/inputs/styles';
import { Field } from 'shared/inputs/Field';

const Details: React.FC = () => {
    return (
        <>
            <FormTitle>Fill Appointment Details</FormTitle>
            <Field type="text" name="title" id="title" label="Title" />
            <Field as="textarea" type="text" name="description" id="description" label="Description" />
        </>
    );
};

export { Details };
