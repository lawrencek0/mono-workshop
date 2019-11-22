import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAuthDispatch } from 'auth/hooks';

const Logout: React.FC<RouteComponentProps> = () => {
    const dispatch = useAuthDispatch();
    dispatch({ type: 'logout' });

    // @TODO: instead show a popup/notification
    return <>Logging you out</>;
};

export { Logout };
