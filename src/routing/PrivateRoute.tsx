import React from 'react';
import { useAuthState } from 'auth/hooks';
import { Role } from 'user/types';
import { RouteComponentProps, navigate } from '@reach/router';
import Login from 'login/Login';
import { rbacRules } from './rules';
import { Dashboard } from 'dashboard/Dashboard';

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
    };

const RouteGuard = <P extends {}>(props: Props<P>): JSX.Element => {
    // variadic spread: https://github.com/microsoft/TypeScript/issues/5453
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { as: Component, action, location, ...rest } = props as any;
    const { role } = useAuthState();

    if (can(action, role)) {
        return <Component {...rest} />;
    }

    if (role) {
        navigate('/');
        return <Dashboard />;
    }

    let to = '/';

    if (location) {
        to = location.pathname;
    }

    navigate('/login');
    return <Login to={to} />;
};

export { RouteGuard };
