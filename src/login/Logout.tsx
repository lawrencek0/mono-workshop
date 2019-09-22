import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAuthDispatch, logout } from 'auth/hooks';

const Logout: React.FC<RouteComponentProps> = () => {
    const dispatch = useAuthDispatch();
    logout(dispatch);
    // @TODO: instead show a popup/notification
    return <h1>Logging you out</h1>;
};

export { Logout };
