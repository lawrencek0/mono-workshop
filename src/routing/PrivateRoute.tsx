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

type Props = RouteComponentProps & {
    as: React.ComponentType;
    action: string;
};

const RouteGuard: React.FC<Props> = ({ as: Component, action, location, ...props }) => {
    const { role } = useAuthState();

    if (can(action, role)) {
        return <Component {...props} />;
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
