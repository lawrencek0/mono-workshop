import React, { useEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/Calendar';
import Sidebar from './Sidebar';
import { useEventState, useEventDispatch, fetchAppointments } from 'event/hooks';

const Dashboard: React.FC<{}> = () => {
    const { selectedAppointment, appointment } = useEventState();
    const dispatch = useEventDispatch();

    useEffect(() => {
        fetchAppointments(dispatch);
    }, []);

    return (
        <Wrapper>
            <StyledCalendar selectedAppointment={selectedAppointment} />
            <StyledSidebar appointments={appointment} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
`;

const StyledCalendar = styled(Calendar)`
    ${tw`flex-1 lg:border-r-2`}
`;

const StyledSidebar = styled(Sidebar)`
    ${tw`flex-0 w-3/12`}
`;

export default Dashboard;
