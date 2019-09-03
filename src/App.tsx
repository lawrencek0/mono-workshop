import React from 'react';
import './App.css';
import Login from './login/Login';
import SignUp from './login/Signup';

const App: React.FC = () => {
    return (
        <div className="App">
            <Login />
            <SignUp />
        </div>
    );
};

export default App;
