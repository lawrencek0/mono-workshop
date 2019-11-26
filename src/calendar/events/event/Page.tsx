import React, { Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { FormWrapper } from 'shared/inputs/styles';
import { RouteGuard } from 'routing/PrivateRoute';
import { View } from './View';

export type Props = RouteComponentProps & { eventId?: string };

const Page: React.FC<Props> = ({ eventId }) => {
    console.log(eventId);
    return (
        <FormWrapper>
            <Suspense fallback={<div>Loading your event...</div>}>
                <Router>
                    <RouteGuard as={View} path="/" action="events:visit" />
                </Router>
            </Suspense>
        </FormWrapper>
    );
};

export default Page;
