import React, { useEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/FullCalendarWrapper';
import Sidebar from './Sidebar';
import { useEventState, useEventDispatch, fetchAppointments } from 'calendar/hooks';

const Dashboard: React.FC<{}> = () => {
    const { events } = useEventState();
    const dispatch = useEventDispatch();

    const filledAppointments = events
        ? events
              .filter(({ student, faculty }) => student || faculty)
              .map(({ title, student, faculty, ...event }) => ({
                  ...event,
                  student,
                  faculty,
                  title: faculty
                      ? `Appointment with ${faculty.firstName} - ${title}`
                      : `Appointment with ${student.firstName} - ${title}`,
              }))
        : [];

    useEffect(() => {
        fetchAppointments(dispatch);
    }, [dispatch]);

    return (
        <Wrapper>
            <StyledCalendar selectedAppointment={filledAppointments} />
            <StyledSidebar appointments={filledAppointments} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
    max-height: calc(100vh - 84px - 0.5em);
`;

const StyledCalendar = styled(Calendar)`
    ${tw`flex-1 lg:border-r-2`}
`;

const StyledSidebar = styled(Sidebar)`
    ${tw`flex-0 w-3/12`}
`;

export default Dashboard;
