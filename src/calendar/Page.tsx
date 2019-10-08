import React, { lazy } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import Dashboard from './dashboard/Dashboard';
import Select from './appointment/Select';

const AppointmentForm = lazy(() => import('./forms/appointments/AppointmentForm'));

const Calendar: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <StyledRouter>
                <RouteGuard as={Dashboard} action="events:visit" path="/"></RouteGuard>
                <RouteGuard as={Select} action="events:visit" path="appointment/:slotId"></RouteGuard>
                <RouteGuard as={AppointmentForm} action="events:add" path="appointment/new/:step"></RouteGuard>
            </StyledRouter>
        </Main>
    );
};

const StyledRouter = styled(Router)`
    ${tw`h-full`}
`;

export default Calendar;
