import React, { useState, useRef } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import Calendar from 'calendar/dashboard/Calendar';
import { Modal } from './Modal';
import FullCalendar from '@fullcalendar/react';

const Dashboard: React.FC<{}> = () => {
    const [modalInfo, setModalInfo] = useState<{ top?: number; left?: number }>({});
    const calendarRef = useRef<FullCalendar>(null);
    const modalRef = useRef<HTMLElement>(null);

    const calculateModalPos = (calendar: HTMLElement, cell: HTMLElement, modal: HTMLElement): typeof modalInfo => {
        const { top: calendarTop, left: calendarLeft } = calendar.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = cell.getBoundingClientRect();
        const { width: modalWidth, height: modalHeight } = modal.getBoundingClientRect();

        // calculates the position of the clicked cell in the calendar
        const cellPos = {
            xPos: (right - calendarLeft) / width,
            yPos: (bottom - calendarTop) / height,
        };

        const pos: typeof modalInfo = {};

        // if the cell is the first 3 horiontally then render on the right else on the left
        if (cellPos.xPos < 4) {
            pos.left = right + 10;
        } else {
            pos.left = left - modalWidth;
        }

        // position the top so that it doesn't go outside the calendar and appears distinct when opened
        if (cellPos.yPos < 4) {
            pos.top = top + 10;
        } else if (cellPos.yPos < 5) {
            pos.top = top - modalHeight / 2;
        } else if (cellPos.yPos < 7) {
            pos.top = top - modalHeight / 4;
        } else {
            pos.top = top - modalHeight / 1.5;
        }

        return pos;
    };

    const handleDateClick = ({ dayEl }: { dayEl: HTMLElement }): void => {
        if (calendarRef.current && modalRef.current) {
            setModalInfo(calculateModalPos(calendarRef.current.getApi().el, dayEl, modalRef.current));
        }
    };

    return (
        <Wrapper>
            <Modal ref={modalRef} position={modalInfo} />
            <Calendar ref={calendarRef} dateClick={handleDateClick} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
`;

export default Dashboard;
