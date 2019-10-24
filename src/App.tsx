import React, { Suspense } from 'react';
import Login from 'login/Login';
import { Router, RouteComponentProps, Link } from '@reach/router';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';
import { Logout } from 'login/Logout';
import { createGlobalStyle } from 'styled-components/macro';

const GlobalStyle = createGlobalStyle`
    body {
        background: #f9f9f9;
    }
`;

const App: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GlobalStyle />
            <Router>
                <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
                <RouteGuard as={Login} action="login" path="/login" />
                <Logout path="/logout" />
                <NotFoundPage path="*" />
            </Router>
        </Suspense>
    );
};

const NotFoundPage: React.FC<RouteComponentProps> = () => {
    return (
        <>
            <h1>Oh no!</h1>
            <h3>
                You have stepped into the void! <Link to="/">Quick over here</Link>
            </h3>
        </>
    );
};

export default App;
