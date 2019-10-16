import React, { useEffect, useState } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { RouteComponentProps } from '@reach/router';
import { useAuthState } from 'auth/hooks';
import { Main } from 'navigation/Main';
import Card from 'calendar/dashboard/Card';
import { Appointment } from 'calendar/types';
import { fetchUntakenAppointments } from './client';

const StudentDashboard: React.FC<{}> = () => {
    const [events, setEvents] = useState<Appointment[]>([]);
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const appointments = await fetchUntakenAppointments();
            setEvents(appointments);
        };
        fetchData();
    }, []);
    return (
        <>
            <Wrapper>
                {events.map(event => {
                    return <Card key={event.id} {...event} color="red" />;
                })}
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    ${tw`flex content-around`}
    > div {
        ${tw`ml-4 w-1/5`}
    }
`;

const Dashboard: React.FC<RouteComponentProps> = () => {
    const { role } = useAuthState();

    return <Main>{role === 'student' && <StudentDashboard />}</Main>;
};

export { Dashboard };
