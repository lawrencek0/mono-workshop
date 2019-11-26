import React from 'react';
import { useAuthState } from 'auth/hooks';
import { RouteComponentProps, navigate } from '@reach/router';
import Login from 'auth/Login';
import { rbacRules } from './rules';
import { Dashboard } from 'dashboard/Dashboard';
import { Role } from 'resources/UserResource';

const can = (action: string, role?: Role): boolean => {
    if (!role) {
        return false;
    }

    const rules = rbacRules[role];

    if (rules && rules.static.includes(action)) {
        return true;
    }

    return false;
};

type Props<P> = RouteComponentProps &
    P & {
        as: React.FC<P>;
        action: string;
        children?: JSX.Element;
    };

const RouteGuard = <P extends {}>(props: Props<P>): JSX.Element => {
    // variadic spread: https://github.com/microsoft/TypeScript/issues/5453
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { as: Component, action, location, children, ...rest } = props as any;
    const { user, accessToken } = useAuthState();

    let to = '/';

    if (location) {
        to = location.pathname;
    }

    if (!accessToken && action === 'login') {
        return <Component {...rest}>{children}</Component>;
    }

    if (!accessToken) {
        navigate('/login');
        return <Login to={to} />;
    }

    const { role } = user;

    if (can(action, role)) {
        return <Component {...rest}>{children}</Component>;
    }

    // @TODO: instead navigate to previous route with a message?
    navigate('/');
    return <Dashboard />;
};

export { RouteGuard };
