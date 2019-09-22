import React from 'react';
import Login from 'login/Login';
import { Router, RouteComponentProps } from '@reach/router';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
            <RouteGuard as={Login} action="login" path="/login" />
            <NotFoundPage path="*" />
        </Router>
    );
};

const NotFoundPage: React.FC<RouteComponentProps> = () => {
    return (
        <>
            <h1>Oh no!</h1>
            <h3>You have stepped into the void!</h3>
        </>
    );
};

export default App;
