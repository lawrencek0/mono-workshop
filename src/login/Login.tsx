import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { login, useAuthDispatch } from 'auth/hooks';
import { localStorageKey } from 'utils/storage';
import {
    FormWrapper,
    FormTitle,
    StyledSubmitBtn,
    StyledCheckboxLabel,
    StyledLabel,
    StyledInput,
    InputWrapper,
} from 'shared/inputs';
import { UserPayload } from './types';

const Login: React.FC<RouteComponentProps & { to?: string; replace?: boolean }> = ({ to = '/', replace = false }) => {
    // @TODO: handle login failure
    const [inputs, setInputs] = useState({
        email: localStorage.getItem(localStorageKey('email')) || '',
        password: '',
    });
    const [rememberUser, setRememberUser] = useState(
        localStorage.getItem(localStorageKey('rememberMe')) === 'true' || false,
    );

    const dispatch = useAuthDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<UserPayload | void> => {
        if (e) {
            e.preventDefault();
        }

        if (inputs.email === '' || inputs.password === '') return;

        // @TODO need better error handling
        try {
            await login(dispatch, inputs);
        } catch (e) {
            throw new Error(`There was a error logging in: ${e}`);
        }
        if (rememberUser) {
            localStorage.setItem(localStorageKey('email'), inputs.email);
            localStorage.setItem(localStorageKey('rememberMe'), 'true');
        } else {
            localStorage.removeItem(localStorageKey('email'));
            localStorage.removeItem(localStorageKey('rememberMe'));
        }
        if (!to.includes('login')) {
            navigate(to, { replace });
        }
    };

    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setInputs(inputs => ({ ...inputs, [currentTarget.name]: currentTarget.value }));
    };

    const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>): void => {
        setRememberUser(!rememberUser);
    };

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <FormTitle>Login</FormTitle>
                <InputWrapper>
                    <StyledLabel htmlFor="email">Email</StyledLabel>
                    <StyledInput
                        type="email"
                        name="email"
                        id="email"
                        value={inputs.email}
                        onChange={handleInputChange}
                    />
                </InputWrapper>
                <InputWrapper>
                    <StyledLabel htmlFor="password">Password</StyledLabel>
                    <StyledInput
                        type="password"
                        name="password"
                        id="password"
                        value={inputs.password}
                        onChange={handleInputChange}
                    />
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
                    <StyledSubmitBtn type="submit" value="Login" />
                </InputWrapper>
            </form>
        </Wrapper>
    );
};

const Wrapper = styled(FormWrapper)`
    ${tw`lg:w-1/4`}
`;

export default Login;
