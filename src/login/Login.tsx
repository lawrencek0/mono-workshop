import React, { useState, Fragment } from 'react';

const Login: React.FC<{}> = () => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    });
    const [res, setRes] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        if (e) {
            e.preventDefault();
        }

        if (inputs.email === '' || inputs.password === '') return;

        const res = await fetch('/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs),
        });
        const msg = await res.json();

        if (msg && msg.token) {
            setRes("Successfully logged in. Here's your token " + msg.token);
        } else {
            setRes('FAILED TO LOGIN ' + JSON.stringify(msg));
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
                    <legend className="ph0 mh0 fw6 clip">Login</legend>
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
