import React, { Suspense, lazy } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { FormWrapper } from 'shared/inputs/styles';
import { RouteGuard } from 'routing/PrivateRoute';
import { View } from './View';

export type Props = RouteComponentProps & { eventId?: string };

const EventEditForm = lazy(() => import('./Edit'));

const Page: React.FC<Props> = () => {
    return (
        <FormWrapper>
            <Suspense fallback={<div>Loading your event...</div>}>
                <Router>
                    <RouteGuard as={View} path="/" action="events:visit" />
                    <RouteGuard as={EventEditForm} path="/edit" action="events:visit" />
                </Router>
            </Suspense>
        </FormWrapper>
    );
};

export default Page;
