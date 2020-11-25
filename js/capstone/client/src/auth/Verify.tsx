import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, Form } from 'formik';
import { Field } from 'shared/inputs/Field';
import { FormTitle, InputWrapper, StyledSubmitBtn } from 'shared/inputs/styles';
import { Wrapper, ErrorMessage, StyledProgress } from './Login';

const Verify: React.FC<RouteComponentProps> = () => {
    return (
        <Formik
            initialValues={{ email: '', code: '', newPassword: '' }}
            validate={values => {
                const errors = {} as { email: string; code: string; newPassword: string };

                if (!values.email) {
                    errors.email = 'Required';
                } else if (!/^[A-Z0-9]+@(warhawks.ulm|ulm).edu$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
                }

                if (!values.code) {
                    errors.code = 'Required';
                }

                if (!values.newPassword) {
                    errors.newPassword = 'Required';
                }

                return errors;
            }}
            onSubmit={async (values, actions) => {
                try {
                    await fetch('/api/auth/recovery', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...values }),
                    });
                    await navigate('/login');
                } catch (e) {
                    actions.setSubmitting(false);
                    const msg = e.response.body ? e.response.body.message : e.response.text;
                    actions.setStatus(msg);
                }
            }}
        >
            {props => {
                const isDisabled = !props.isValid || props.isSubmitting;
                return (
                    <Wrapper variant={props.status && !props.isSubmitting ? 'danger' : 'default'}>
                        {props.isSubmitting && <StyledProgress />}
                        <Form>
                            <FormTitle>Verify Account</FormTitle>
                            <ErrorMessage>{props.status}</ErrorMessage>
                            <Field name="email" type="email" id="email" label="Email" {...props} />
                            <Field name="code" type="text" id="text" label="Verification Code" {...props} />
                            <Field name="newPassword" type="password" id="newPassword" label="Password" {...props} />
                            <InputWrapper>
                                <StyledSubmitBtn
                                    type="submit"
                                    value="Submit"
                                    disabled={isDisabled}
                                    variant={isDisabled ? 'disabled' : 'default'}
                                />
                            </InputWrapper>
                        </Form>
                    </Wrapper>
                );
            }}
        </Formik>
    );
};

export default Verify;
