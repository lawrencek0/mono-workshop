import React from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/Calendar';
import Sidebar from './Sidebar';

const Dashboard: React.FC<{}> = () => {
    return (
        <Wrapper>
            <StyledCalendar />
            <StyledSidebar />
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
