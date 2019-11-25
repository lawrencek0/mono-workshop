import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, FormikProps } from 'formik';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useFetcher } from 'rest-hooks';
import { useAuthDispatch } from 'auth/hooks';
import { localStorageKey } from 'utils/storage';
import {
    FormWrapper,
    FormTitle,
    StyledSubmitBtn,
    StyledCheckboxLabel,
    InputWrapper,
    Variant,
} from 'shared/inputs/styles';
import { Field } from 'shared/inputs/Field';
import { Progress } from 'shared/Progress';
import { UserResource } from 'resources/UserResource';

type FormValues = {
    email: string;
    password: string;
};

const Login: React.FC<RouteComponentProps & { to?: string; replace?: boolean }> = ({ to = '/', replace = false }) => {
    const dispatch = useAuthDispatch();
    const login = useFetcher(UserResource.makeCurrentUserShape());
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
                    const { accessToken, refreshToken, idToken, ...user } = await login({}, values);
                    dispatch({ type: 'login', payload: { accessToken, refreshToken, idToken, user } });
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
                    actions.resetForm({ values: { ...values, password: '' } });
                    const msg = e.response.body ? e.response.body.message : e.response.text;
                    actions.setStatus(msg);
                }
            }}
        >
            {(props: FormikProps<FormValues>) => {
                const isDisabled = !props.isValid || props.isSubmitting;
                return (
                    <Wrapper variant={props.status && !props.isSubmitting ? 'danger' : 'default'}>
                        {props.isSubmitting && <StyledProgress />}
                        {/* @FIXME: Switch to Form (broken rn) https://github.com/jaredpalmer/formik/issues/1927 */}
                        <form onSubmit={props.handleSubmit}>
                            <FormTitle>Login</FormTitle>
                            <ErrorMessage>{props.status}</ErrorMessage>
                            <Field name="email" type="email" id="email" label="Email" {...props} />
                            <Field type="password" id="password" name="password" label="Password" {...props} />
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
                                    disabled={isDisabled}
                                    variant={isDisabled ? 'disabled' : 'default'}
                                />
                            </InputWrapper>
                        </form>
                    </Wrapper>
                );
            }}
        </Formik>
    );
};

const StyledProgress = styled(Progress)`
    ${tw`absolute inset-0`}
`;

export const ErrorMessage = styled.div`
    ${tw`text-red-400 mb-2 font-semibold`}
`;

export const Wrapper = styled(FormWrapper)<{ variant: Variant }>`
    ${tw`relative w-10/12 md:w-6/12 lg:w-4/12 xl:w-1/4`}
    ${props => props.variant === 'danger' && tw`border-t-4 border-red-500`}
`;

export default Login;
