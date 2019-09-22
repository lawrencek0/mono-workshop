import React from 'react';
import Login from 'login/Login';
import { Router } from '@reach/router';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
            <RouteGuard as={Login} action="login" path="/login" />
        </Router>
    );
};

export default App;
