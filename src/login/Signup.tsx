//@TODO: ONLY FOR DEMO. REMOVE AFTERWARDS
import React, { useState, Fragment } from 'react';

const SignUp: React.FC<{}> = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const [res, setRes] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        if (e) {
            e.preventDefault();
        }

        if (inputs.username === '' || inputs.password === '') return;

        const res = await fetch('/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs),
        });
        const msg = await res.json();

        if (msg && msg.message === 'success') {
            setRes('Successfully created new user. Try signing in');
        } else {
            setRes('FAILED TO SIGN UP ' + JSON.stringify(msg));
        }
    };

    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setInputs(inputs => ({ ...inputs, [currentTarget.name]: currentTarget.value }));
    };

    return (
        <Fragment>
            <pre>{res}</pre>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend className="ph0 mh0 fw6">Signup</legend>
                    <div className="mt3">
                        <label className="db fw4 lh-copy f6" htmlFor="username">
                            username
                        </label>
                        <input
                            className="pa2 input-reset ba bg-transparent w-100 measure"
                            type="username"
                            name="username"
                            id="username"
                            value={inputs.username}
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

export default SignUp;
