import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Login from './login/Login';
import SignUp from './login/Signup';

const App: React.FC = () => {
    const [theme] = useState('light');

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <div className="App">
                <Login />
                <SignUp />
            </div>
        </ThemeProvider>
    );
};

export default App;
