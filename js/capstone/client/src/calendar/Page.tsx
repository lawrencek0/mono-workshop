import React, { lazy, Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { NetworkErrorBoundary, NetworkError } from 'rest-hooks';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import Dashboard from './dashboard/Dashboard';
import Select from './appointment/Select';
import Event from './events/Page';

const AppointmentCreationForm = lazy(() => import('./appointment/create/Form'));

const ErrorComponent: React.FC<{ error: NetworkError }> = ({ error }) => {
    return (
        <div css={tw`max-w-4xl m-auto mt-8`}>
            <p>
                <strong>Oops! An error occured!</strong>
            </p>
            <div>
                {error.status}: {error.message}
            </div>
            {error.response && <pre css={tw`whitespace-pre-line`}>{JSON.stringify(error.response.body)}</pre>}
        </div>
    );
};

const Calendar: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Suspense fallback={<div>Loading events...</div>}>
                <NetworkErrorBoundary fallbackComponent={ErrorComponent}>
                    <StyledRouter>
                        <RouteGuard as={Dashboard} action="events:visit" path="/"></RouteGuard>
                        {/* @TODO: add dynamic RBAC rules? */}
                        <RouteGuard as={Select} action="events:visit" path="appointments/:detailId"></RouteGuard>
                        {/* @FIXME: use query params instead? */}
                        <RouteGuard
                            as={AppointmentCreationForm}
                            action="events:add"
                            path="appointments/new/:step"
                        ></RouteGuard>
                        <Event path="events/*" />
                    </StyledRouter>
                </NetworkErrorBoundary>
            </Suspense>
        </Main>
    );
};

const StyledRouter = styled(Router)`
    ${tw`h-full`}
`;

export default Calendar;
