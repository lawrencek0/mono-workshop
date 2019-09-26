import React, { Suspense, lazy } from 'react';
import Login from 'login/Login';
import { Router, RouteComponentProps, Link } from '@reach/router';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';
import { Logout } from 'login/Logout';

const EventPage = lazy(() => import('event/Event'));

const App: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Router>
                <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
                <RouteGuard as={EventPage} action="events:visit" path="events/*" />
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
