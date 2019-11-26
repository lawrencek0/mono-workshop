import React, { Suspense, lazy } from 'react';
import { Router, RouteComponentProps, Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components/macro';
import Login from 'auth/Login';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';
import { Logout } from 'auth/Logout';
import { useAuthState } from 'auth/hooks';

const Calendar = lazy(() => import('calendar/Page'));
const Group = lazy(() => import('groups/Page'));
const Fab = lazy(() => import('./Fab'));
const ForgetPass = lazy(() => import('auth/ForgetPass'));
const Token = lazy(() => import('auth/Token'));
const Verify = lazy(() => import('auth/Verify'));

const GlobalStyle = createGlobalStyle`
    html {
        body {
            background: #f9f9f9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
            "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", 
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
    }
`;

const App: React.FC = () => {
    const { accessToken } = useAuthState();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GlobalStyle />
            <Router>
                <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
                <RouteGuard as={Calendar} action="events:visit" path="calendar/*" />
                <Group path="groups/*" />
                <RouteGuard as={Login} action="login" path="/login" />
                <RouteGuard as={ForgetPass} action="login" path="/forget-password" />
                <RouteGuard as={Logout} action="logout" path="/logout" />
                <RouteGuard as={Token} action="login" path="/verify-token" />
                <RouteGuard as={Verify} action="login" path="/verify-user" />
                <NotFoundPage path="*" />
            </Router>
            {accessToken && <Fab />}
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
