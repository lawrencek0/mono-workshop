import React, { Suspense, lazy } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import { Dashboard } from './Dashboard';
import { Group } from './group/Page';

const GroupCreationForm = lazy(() => import('./Create'));

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Suspense fallback={<div>Loading group...</div>}>
                <Router>
                    <RouteGuard as={Dashboard} path="/" action="groups:visit" />
                    <RouteGuard as={GroupCreationForm} path="/new" action="groups:create" />
                    <Group path=":groupId/*" />
                </Router>
            </Suspense>
        </Main>
    );
};

export default Page;
