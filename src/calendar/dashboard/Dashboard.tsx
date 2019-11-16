import React from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/dashboard/Calendar';

const Dashboard: React.FC<{}> = () => {
    return (
        <Wrapper>
            <StyledCalendar />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
`;

const StyledCalendar = styled(Calendar)`
    ${tw`flex-1 lg:border-r-2`}
`;

// @TODO: add new sidebar
// const StyledSidebar = styled(Sidebar)`
//     ${tw`flex-0 w-3/12`}
// `;

export default Dashboard;
