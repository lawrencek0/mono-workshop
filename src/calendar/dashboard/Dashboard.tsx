import React, { useState } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/dashboard/Calendar';
import { DateClickApi } from '@fullcalendar/core/Calendar';
import { Modal } from './Modal';

const Dashboard: React.FC<{}> = () => {
    const [modalInfo, setModalInfo] = useState<{ left?: number; top?: number }>({});
    const handleDateClick = ({ dayEl }: DateClickApi): void => {
        const { clientHeight, clientWidth } = document.body;
        const { left, right, top, bottom, width, height } = dayEl.getBoundingClientRect();
        const x = left > clientWidth - right ? left - width : right;
        const y = top > clientHeight - bottom ? top - height : bottom - height;

        setModalInfo({ left: x, top: y });
    };
    return (
        <Wrapper>
            <Modal position={modalInfo} />
            <StyledCalendar dateClick={handleDateClick} />
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
