import React, { lazy } from 'react';
import { RouteComponentProps, Link, Router } from '@reach/router';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';

const EventForm = lazy(() => import('./EventForm'));

const Event: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Link to="add/1">Add</Link>
            <Router>
                <RouteGuard as={EventForm} action="events:add" path="add/:step"></RouteGuard>
            </Router>
        </Main>
    );
};

export default Event;
