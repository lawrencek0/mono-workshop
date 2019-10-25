import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { login, useAuthDispatch } from 'auth/hooks';
import { localStorageKey } from 'utils/storage';
import {
    FormWrapper,
    FormTitle,
    StyledSubmitBtn,
    StyledCheckboxLabel,
    InputWrapper,
    SuperInput,
    Variant,
} from 'shared/inputs';

type FormValues = {
    email: string;
    password: string;
};

const Login: React.FC<RouteComponentProps & { to?: string; replace?: boolean }> = ({ to = '/', replace = false }) => {
    const dispatch = useAuthDispatch();
    const [rememberUser, setRememberUser] = useState(
        localStorage.getItem(localStorageKey('rememberMe')) === 'true' || false,
    );

    const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>): void => {
        setRememberUser(!rememberUser);
    };

    return (
        <Formik
            initialValues={{ email: localStorage.getItem(localStorageKey('email')) || '', password: '' }}
            validate={values => {
                const errors = {} as FormValues;

                if (!values.email) {
                    errors.email = 'Required';
                } else if (!/^[A-Z0-9]+@(warhawks.ulm|ulm).edu$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
                }

                if (!values.password) {
                    errors.password = 'Required';
                }

                return errors;
            }}
            onSubmit={async (values, actions) => {
                try {
                    await login(dispatch, values);
                    if (rememberUser) {
                        localStorage.setItem(localStorageKey('email'), values.email);
                        localStorage.setItem(localStorageKey('rememberMe'), 'true');
                    } else {
                        localStorage.removeItem(localStorageKey('email'));
                        localStorage.removeItem(localStorageKey('rememberMe'));
                    }
                    if (!to.includes('login')) {
                        navigate(to, { replace });
                    }
                } catch (e) {
                    actions.setSubmitting(false);
                    actions.resetForm({ ...values, password: '' });
                    actions.setStatus(e.message);
                }
            }}
            render={({ isSubmitting, isValid, status }: FormikProps<FormValues>) => (
                <Wrapper variant={status ? 'danger' : 'default'}>
                    <Form>
                        <FormTitle>Login</FormTitle>
                        <ErrorMessage>{status}</ErrorMessage>
                        <Field
                            name="email"
                            render={(props: FieldProps<FormValues>) => (
                                <SuperInput type="email" id="email" label="Email" {...props} />
                            )}
                        />
                        <Field
                            name="password"
                            render={(props: FieldProps<FormValues>) => (
                                <SuperInput type="password" id="password" label="Password" {...props} />
                            )}
                        />
                        <InputWrapper>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={rememberUser}
                                onChange={handleCheckboxChange}
                            />
                            <StyledCheckboxLabel htmlFor="rememberMe">Remember Me</StyledCheckboxLabel>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubmitBtn
                                type="submit"
                                value="Login"
                                disabled={isSubmitting}
                                variant={isSubmitting || !isValid ? 'disabled' : 'default'}
                            />
                        </InputWrapper>
                    </Form>
                </Wrapper>
            )}
        />
    );
};

const ErrorMessage = styled.div`
    ${tw`text-red-400 mb-2 font-semibold`}
`;

const Wrapper = styled(FormWrapper)<{ variant: Variant }>`
    ${tw`lg:w-1/4`}
    ${props => props.variant === 'danger' && tw`border-t-4 border-red-500`}
`;

export default Login;
