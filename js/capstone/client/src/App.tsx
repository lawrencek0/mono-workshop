import React, { Suspense, lazy } from 'react';
import { Router, RouteComponentProps, Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components/macro';
import Login from 'auth/Login';
import { RouteGuard } from 'routing/PrivateRoute';
import { Logout } from 'auth/Logout';
import { useAuthState } from 'auth/hooks';
import { bodyColor, textColor } from 'themes/theme';

const Calendar = lazy(() => import('calendar/Page'));
const Group = lazy(() => import('groups/Page'));
const ForgetPass = lazy(() => import('auth/ForgetPass'));
const Token = lazy(() => import('auth/Token'));
const Verify = lazy(() => import('auth/Verify'));
const Settings = lazy(() => import('settings/Page'));

const GlobalStyle = createGlobalStyle`
    html {
        body {
            background: ${bodyColor};
            color: ${textColor};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
            "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", 
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
    }
`;

const App: React.FC = () => {
    const { user } = useAuthState();

    const Dashboard =
        user?.role === 'admin' ? lazy(() => import('dashboard/Admin')) : lazy(() => import('dashboard/Dashboard'));
    const Fab = user?.role !== 'admin' && lazy(() => import('./Fab'));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GlobalStyle />
            <Router>
                <RouteGuard as={Dashboard} action="dashboard:visit" path="/" />
                <RouteGuard as={Calendar} action="events:visit" path="calendar/*" />
                <RouteGuard as={Group} action="groups:visit" path="groups/*" />
                <RouteGuard as={Settings} action="events:visit" path="settings/*" />
                <RouteGuard as={Login} action="login" path="/login" />
                <RouteGuard as={ForgetPass} action="login" path="/forget-password" />
                <RouteGuard as={Logout} action="logout" path="/logout" />
                <RouteGuard as={Token} action="login" path="/verify-token" />
                <RouteGuard as={Verify} action="login" path="/verify-user" />
                <NotFoundPage path="*" />
            </Router>
            {Fab && <Fab />}
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
