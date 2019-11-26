import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { useResource } from 'rest-hooks';
import { RouteComponentProps } from '@reach/router';
import * as queryString from 'query-string';
import FullCalendar from '@fullcalendar/react';
import { DateClickApi } from '@fullcalendar/core/Calendar';
import Calendar from 'calendar/dashboard/Calendar';
import { Modal, Props as ModalProps, Position } from './Modal';
import { getDate } from 'calendar/helpers';
import { AppointmentResource } from 'resources/AppointmentResource';
import { useAuthState } from 'auth/hooks';
import { GroupEventResource } from 'resources/GroupResource';
import { EventResource } from 'resources/EventResource';

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

const Dashboard: React.FC<RouteComponentProps> = ({ navigate }) => {
    const [modalInfo, setModalInfo] = useState<Pick<ModalProps, 'position' | 'startDate'>>({});
    const calendarRef = useRef<FullCalendar>(null);
    const modalRef = useRef<HTMLElement>(null);
    const [appointments, groupEvents, events] = useResource(
        [AppointmentResource.listShape(), {}],
        [GroupEventResource.fetchAll(), {}],
        [EventResource.listShape(), {}],
    );

    const {
        user: { role },
    } = useAuthState();

    const allEvents = useMemo(() => {
        const appts =
            role === 'faculty'
                ? appointments.flatMap(({ title, id, userProps = { hexColor: '' }, slots = [] }) =>
                      slots.map(slot => ({
                          ...slot,
                          groupId: id,
                          type: 'appointments',
                          slotId: slot.id,
                          title,
                          borderColor: userProps.hexColor,
                          backgroundColor: userProps.hexColor,
                      })),
                  )
                : appointments.flatMap(({ title, id, userProps = { hexColor: '' }, slots = [] }) => {
                      return slots
                          .filter(({ student }) => student && typeof student !== 'boolean')
                          .map(slot => ({
                              ...slot,
                              detailId: id,
                              type: 'appointments',
                              slotId: slot.id,
                              title,
                              borderColor: userProps.hexColor,
                              backgroundColor: userProps.hexColor,
                          }));
                  });
        const groupEvts = groupEvents.map(event => ({
            ...event,
            type: 'groupEvent',
            groupsId: event.group ? event.group.id : 1,
            eventId: event.id,
        }));
        const evts = events.map(event => ({
            ...event,
            type: 'events',
            eventId: event.id,
            borderColor: event.color,
            backgroundColor: event.color,
        }));

        return [...appts, ...groupEvts, ...evts];
    }, [appointments, role, groupEvents, events]);

    const hideModal = (): void => {
        setModalInfo({ position: undefined });
    };

    const { activateModal } = queryString.parse(window.location.search);

    const handleDocClick = ({ target }: MouseEvent): void => {
        if (calendarRef.current && modalRef.current && target) {
            if (
                calendarRef.current.getApi().el.contains(target as Node) ||
                modalRef.current.contains(target as Node) ||
                !document.body.contains(target as Node)
            ) {
                return;
            }
        }
        setModalInfo({ position: undefined });
    };

    useEffect(() => {
        document.addEventListener('click', handleDocClick);

        return () => {
            document.removeEventListener('click', handleDocClick);
        };
    }, []);

    useLayoutEffect(() => {
        (async () => {
            if (activateModal) {
                while (!calendarRef.current || !modalRef.current) {
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                let el = calendarRef.current.getApi().el.querySelector('.fc-today') as HTMLElement;
                while (!el || el.getBoundingClientRect().height === 0) {
                    el = calendarRef.current.getApi().el.querySelector('.fc-today') as HTMLElement;
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                const position = calculateModalPos(calendarRef.current.getApi().el, el, modalRef.current);
                setModalInfo({ position });
            }
        })();

        return () => {
            setModalInfo({ position: undefined });
        };
    }, [activateModal]);

    const handleDateClick = ({ dayEl, date }: DateClickApi): void => {
        if (calendarRef.current && modalRef.current) {
            const position = calculateModalPos(calendarRef.current.getApi().el, dayEl, modalRef.current);
            setModalInfo({
                position,
                startDate: getDate(date),
            });
        }
    };

    return (
        <Wrapper>
            <Modal ref={modalRef} {...modalInfo} hideModal={hideModal} />
            <Calendar
                eventClick={({ event }) => {
                    if (navigate) {
                        const type = event.extendedProps.type;

                        if (type === 'appointments') {
                            return navigate(`./appointments/${event.extendedProps.detailId}`);
                        }

                        if (type === 'events') {
                            return navigate(`./events/${event.extendedProps.eventId}`);
                        }

                        if (type === 'groupEvent') {
                            return navigate(
                                `/groups/${event.extendedProps.groupsId}/events/${event.extendedProps.eventId}`,
                            );
                        }
                    }
                }}
                events={allEvents}
                ref={calendarRef}
                dateClick={handleDateClick}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex h-full`}
`;

export default Dashboard;
