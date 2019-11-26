import React, { Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { RouteGuard } from 'routing/PrivateRoute';
import Event from './event/Page';

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <Suspense fallback={<div>Loading event</div>}>
            <Router>
                <RouteGuard as={Event} path=":eventId/*" action="events:visit" />
            </Router>
        </Suspense>
    );
};

export default Page;
