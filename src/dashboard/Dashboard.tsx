import React from 'react';
import { useResource } from 'rest-hooks';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { RouteComponentProps } from '@reach/router';
import { useAuthState } from 'auth/hooks';
import { Main } from 'navigation/Main';
import Card from 'shared/cards/Appointment';
import { AppointmentResource } from 'resources/AppointmentResource';

const StudentDashboard: React.FC<{}> = () => {
    const untakenAppointments = useResource(AppointmentResource.listByUntaken(), {});

    return (
        <Wrapper>
            {untakenAppointments.map(event => {
                return <Card key={event.id} {...event} type="appointments" color="red" />;
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex content-around`}
    > div {
        ${tw`ml-4 w-1/5`}
    }
`;

const Dashboard: React.FC<RouteComponentProps> = () => {
    const {
        user: { role },
    } = useAuthState();

    return <Main>{role === 'student' && <StudentDashboard />}</Main>;
};

export { Dashboard };
