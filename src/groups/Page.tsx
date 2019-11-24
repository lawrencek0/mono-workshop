import React, { Suspense, lazy } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import { Dashboard } from './Dashboard';

const GroupCreationForm = lazy(() => import('./Create'));

const Group: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Suspense fallback={<div>Loading group...</div>}>
                <Router>
                    <RouteGuard as={Dashboard} path="/" action="groups:visit" />
                    <RouteGuard as={GroupCreationForm} path="/new" action="groups:create" />
                </Router>
            </Suspense>
        </Main>
    );
};

export default Group;
