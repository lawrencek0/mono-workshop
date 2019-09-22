import React, { useState, Fragment } from 'react';
import { login, useAuthProvider } from '../auth/hooks';
import { UserPayload } from './types';

const Login: React.FC<{}> = () => {
    // @TODO: handle login failure
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    });
    const dispatch = useAuthProvider();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<UserPayload | void> => {
        if (e) {
            e.preventDefault();
        }

        if (inputs.email === '' || inputs.password === '') return;

        return login(dispatch, inputs);
    };

    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setInputs(inputs => ({ ...inputs, [currentTarget.name]: currentTarget.value }));
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend className="ph0 mh0 fw6">Login</legend>
                    <div className="mt3">
                        <label className="db fw4 lh-copy f6" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="pa2 input-reset ba bg-transparent w-100 measure"
                            type="email"
                            name="email"
                            id="email"
                            value={inputs.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt3">
                        <label className="db fw4 lh-copy f6" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="b pa2 input-reset ba bg-transparent"
                            type="password"
                            name="password"
                            id="password"
                            value={inputs.password}
                            onChange={handleInputChange}
                        />
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
