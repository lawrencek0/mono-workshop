import React, { useRef } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Formik, Form } from 'formik';
import { Field } from 'shared/inputs/Field';
import { FormTitle, InputWrapper, StyledSubmitBtn } from 'shared/inputs/styles';
import { Wrapper, ErrorMessage, StyledProgress } from './Login';

const ForgetPass: React.FC<RouteComponentProps> = () => {
    const msg = useRef(false);

    return msg.current ? (
        <Wrapper variant="default">Please check your email!</Wrapper>
    ) : (
        <Formik
            initialValues={{ email: '' }}
            validate={values => {
                const errors = {} as { email: string };

                if (!values.email) {
                    errors.email = 'Required';
                } else if (!/^[A-Z0-9]+@(warhawks.ulm|ulm).edu$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
                }

                return errors;
            }}
            onSubmit={async (values, actions) => {
                try {
                    await fetch('/api/auth/forgotPassword', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: values.email }),
                    });
                    await (async () => (msg.current = true))();
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
                            <FormTitle>Forget Password</FormTitle>
                            <ErrorMessage>{props.status}</ErrorMessage>
                            <Field name="email" type="email" id="email" label="Email" {...props} />
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

export default ForgetPass;
