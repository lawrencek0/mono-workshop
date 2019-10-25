import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { login, useAuthDispatch } from 'auth/hooks';
import { localStorageKey } from 'utils/storage';
import { useFormik, FieldMetaProps } from 'formik';
import { MdInfo } from 'react-icons/md';
import {
    FormWrapper,
    FormTitle,
    StyledSubmitBtn,
    StyledCheckboxLabel,
    StyledLabel,
    StyledInput,
    InputWrapper,
    Variant,
    InputErrorMsg,
} from 'shared/inputs';

const Login: React.FC<RouteComponentProps & { to?: string; replace?: boolean }> = ({ to = '/', replace = false }) => {
    const dispatch = useAuthDispatch();
    const [rememberUser, setRememberUser] = useState(
        localStorage.getItem(localStorageKey('rememberMe')) === 'true' || false,
    );

    // @TODO: handle login failure
    const { getFieldProps, setSubmitting, handleSubmit } = useFormik({
        initialValues: {
            email: localStorage.getItem(localStorageKey('email')) || '',
            password: '',
        },
        validate: values => {
            const errors = {
                email: '',
                password: '',
            };

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9]+@(warhawks.ulm|ulm).edu$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            }

            return errors;
        },
        onSubmit: async values => {
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
                setSubmitting(false);
            }
        },
    });

    const [email, metadataEmail] = getFieldProps({ name: 'email' });
    const [password, metadataPassword] = getFieldProps({ name: 'password' });

    const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>): void => {
        setRememberUser(!rememberUser);
    };

    const getVariant = (metadata: FieldMetaProps<unknown>): Variant => {
        return metadata.touched && metadata.error ? 'danger' : 'default';
    };

    const isInvalid = (metaProps: FieldMetaProps<unknown>[]): boolean => {
        return metaProps.some(meta => !meta.value || meta.error);
    };

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <FormTitle>Login</FormTitle>
                <InputWrapper>
                    <StyledLabel htmlFor="email" variant={getVariant(metadataEmail)}>
                        Email
                    </StyledLabel>
                    <StyledInput type="email" id="email" {...email} variant={getVariant(metadataEmail)} />
                    {metadataEmail.touched && metadataEmail.error && (
                        <InputErrorMsg>
                            <StyledInfo />
                            {metadataEmail.error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <InputWrapper>
                    <StyledLabel htmlFor="password" variant={getVariant(metadataPassword)}>
                        Password
                    </StyledLabel>
                    <StyledInput type="password" id="password" {...password} variant={getVariant(metadataPassword)} />
                    {metadataPassword.touched && metadataPassword.error && (
                        <InputErrorMsg>
                            <StyledInfo />
                            {metadataPassword.error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
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
                        disabled={isInvalid([metadataEmail, metadataPassword])}
                        variant={isInvalid([metadataEmail, metadataPassword]) ? 'disabled' : 'default'}
                    />
                </InputWrapper>
            </form>
        </Wrapper>
    );
};

const StyledInfo = styled(MdInfo)`
    ${tw`inline mr-1`}
`;

const Wrapper = styled(FormWrapper)`
    ${tw`lg:w-1/4`}
`;

export default Login;
