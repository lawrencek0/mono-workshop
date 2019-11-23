import React, { lazy, Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import Dashboard from './dashboard/Dashboard';
import Select from './appointment/Select';

const AppointmentCreationForm = lazy(() => import('./appointment/create/Form'));

const Calendar: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Suspense fallback={<div>Loading events...</div>}>
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
                </StyledRouter>
            </Suspense>
        </Main>
    );
};

const StyledRouter = styled(Router)`
    ${tw`h-full`}
`;

export default Calendar;
