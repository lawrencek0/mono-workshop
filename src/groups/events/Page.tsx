import React, { lazy, Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { RouteGuard } from 'routing/PrivateRoute';
import { View } from './View';

const EventCreationForm = lazy(() => import('./Create'));

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <Suspense fallback={<div>Loading event...</div>}>
            <Router>
                <RouteGuard as={View} path=":eventId" action="groups:visit" />
                <RouteGuard as={EventCreationForm} path="/new" action="groups:visit" />
            </Router>
        </Suspense>
    );
};

export default Page;
