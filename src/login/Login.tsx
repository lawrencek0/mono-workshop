import React, { useState, Fragment } from 'react';
import { login, useAuthDispatch } from '../auth/hooks';
import { UserPayload } from './types';
import { RouteComponentProps, navigate } from '@reach/router';
import { localStorageKey } from 'utils/storage';
import { useFormik, Formik, Form, Field } from 'formik';

const validate = (values: any): any => {
    const errors: any = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Za-z0-9]@(warhawks.ulm.edu|ulm.edu)/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    // other code goes here

    return errors;
};
const Login: React.FC<RouteComponentProps & { to?: string; replace?: boolean }> = ({ to = '/', replace = false }) => {
    // @TODO: handle login failure
    const { getFieldProps, submitForm, errors, touched } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (values: any): any => {
            const errors = {
                email: '',
                password: '',
            };

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[warhawks.ulm.edu]||[ulm.edu]/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            return errors;
        },
        onSubmit: (values: any) => {
            console.log(values);
        },
    });
    const [email, metadataEmail] = getFieldProps({ name: 'email', type: 'text' });
    const [password, metadataPassword] = getFieldProps({ name: 'password', type: 'password' });
    const [inputs, setInputs] = useState({
        email: localStorage.getItem(localStorageKey('email')) || '',
        password: '',
    });
    const [rememberUser, setRememberUser] = useState(
        localStorage.getItem(localStorageKey('rememberMe')) === 'true' || false,
    );

    const dispatch = useAuthDispatch();

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<UserPayload | void> => {
        if (e) {
            e.preventDefault();
        }

        if (inputs.email === '' || inputs.password === '') return;

        // @TODO need better error handling
        try {
            await login(dispatch, inputs);
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
        } catch (e) {
            throw new Error(`There was a error logging in: ${e}`);
        }
    };

    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setInputs(inputs => ({ ...inputs, [currentTarget.name]: currentTarget.value }));
    };

    const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>): void => {
        setRememberUser(!rememberUser);
    };

    return (
        <Fragment>
            <form onSubmit={submitForm && HandleSubmit}>
                <fieldset>
                    <legend className="ph0 mh0 fw6">Login</legend>
                    <div className="mt3">
                        <label className="db fw4 lh-copy f6" htmlFor="email">
                            Email
                        </label>
                        <input {...email}></input>
                        {metadataEmail.touched && metadataEmail.error}
                    </div>
                    <div className="mt3">
                        <label className="db fw4 lh-copy f6" htmlFor="password">
                            Password
                        </label>
                        <input {...password}></input>
                        {metadataPassword.touched && metadataPassword.error}
                    </div>
                    <div className="mt3">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            id="rememberMe"
                            checked={rememberUser}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="rememberMe" className="ml2 fw4 lh-copy-f6">
                            Remember Me
                        </label>
                    </div>
                    <div className="mt3">
                        <input
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6"
                            type="submit"
                            value="Login"
                        />
                    </div>
                </fieldset>
            </form>
        </Fragment>
    );
};

export default Login;
