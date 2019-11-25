import React, { Suspense, lazy } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import 'react-tiny-fab/dist/styles.css';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import { Dashboard } from './Dashboard';
import { Group } from './group/Page';

const GroupCreationForm = lazy(() => import('./Create'));
const PostCreationFrom = lazy(() => import('./posts/Create'));

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Suspense fallback={<div>Loading group...</div>}>
                <Router>
                    <RouteGuard as={Dashboard} path="/" action="groups:visit" />
                    <RouteGuard as={GroupCreationForm} path="/new" action="groups:create" />
                    <RouteGuard as={PostCreationFrom} path="/posts/new" action="groups:visit" />
                    <Group path=":groupId/*" />
                </Router>
            </Suspense>
        </Main>
    );
};

export default Page;
