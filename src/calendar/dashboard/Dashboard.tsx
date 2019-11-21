import React, { useState, useRef } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import { DateClickApi } from '@fullcalendar/core/Calendar';
import Calendar from 'calendar/dashboard/Calendar';
import { Modal, Props as ModalProps, Position } from './Modal';

const Dashboard: React.FC<{}> = () => {
    const [modalInfo, setModalInfo] = useState<Pick<ModalProps, 'position' | 'startDate'>>({});
    const calendarRef = useRef<FullCalendar>(null);
    const modalRef = useRef<HTMLElement>(null);

    const calculateModalPos = (calendar: HTMLElement, cell: HTMLElement, modal: HTMLElement): Position => {
        const { top: calendarTop, left: calendarLeft } = calendar.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = cell.getBoundingClientRect();
        const { width: modalWidth, height: modalHeight } = modal.getBoundingClientRect();

        // calculates the position of the clicked cell in the calendar
        const cellPos = {
            xPos: (right - calendarLeft) / width,
            yPos: (bottom - calendarTop) / height,
        };

        const pos: Position = {};

        // if the cell is the first 3 horiontally then render on the right else on the left
        if (cellPos.xPos < 4) {
            pos.left = right + 10;
        } else {
            pos.left = left - modalWidth - 10;
        }

        // position the top so that it doesn't go outside the calendar and appears distinct when opened
        if (cellPos.yPos < 4) {
            pos.top = top + 10;
        } else if (cellPos.yPos < 5) {
            pos.top = top - modalHeight * 0.5;
        } else if (cellPos.yPos < 7) {
            pos.top = top - modalHeight * 0.8;
        } else {
            pos.top = top - modalHeight * 0.9;
        }

        return pos;
    };

    const handleDateClick = ({ dayEl, date }: DateClickApi): void => {
        if (calendarRef.current && modalRef.current) {
            const position = calculateModalPos(calendarRef.current.getApi().el, dayEl, modalRef.current);
            setModalInfo({
                position,
                startDate: moment(date)
                    .hours(moment().hours())
                    .minute(moment().minutes())
                    .second(0)
                    .millisecond(0),
            });
        }
    };

    return (
        <Wrapper>
            <Modal ref={modalRef} {...modalInfo} />
            <Calendar ref={calendarRef} dateClick={handleDateClick} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
`;

export default Dashboard;
