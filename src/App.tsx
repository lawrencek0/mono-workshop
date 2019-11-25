import React, { Suspense, lazy } from 'react';
import Login from 'auth/Login';
import { Router, RouteComponentProps, Link, navigate } from '@reach/router';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FaPlus } from 'react-icons/fa';
import { FaCalendarPlus } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { Dashboard } from 'dashboard/Dashboard';
import { RouteGuard } from 'routing/PrivateRoute';
import { Logout } from 'auth/Logout';
import { createGlobalStyle } from 'styled-components/macro';
import { useAuthState } from 'auth/hooks';

const Calendar = lazy(() => import('calendar/Page'));
const Group = lazy(() => import('groups/Page'));

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
                <RouteGuard as={Logout} action="logout" path="/logout" />
                <NotFoundPage path="*" />
            </Router>
            {accessToken && <Button />}
        </Suspense>
    );
};

const Button: React.FC = () => {
    return (
        <Fab mainButtonStyles={{ background: '#ed64a6' }} icon={<FaPlus />} event="click">
            <Action text="New event" onClick={() => navigate('/calendar', { state: { activateModal: true } })}>
                <FaCalendarPlus />
            </Action>
            <Action text="New group post" onClick={() => navigate('/groups/posts/new')}>
                <FaUsers />
            </Action>
        </Fab>
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
