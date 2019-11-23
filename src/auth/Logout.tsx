import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAuthDispatch } from 'auth/hooks';
import { useResetter } from 'rest-hooks';

const Logout: React.FC<RouteComponentProps> = () => {
    const resetCache = useResetter();
    const dispatch = useAuthDispatch();
    resetCache();
    dispatch({ type: 'logout' });

    // @TODO: instead show a popup/notification
    return <>Logging you out</>;
};

export { Logout };
