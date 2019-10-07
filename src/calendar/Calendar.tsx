import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled, { css } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import moment from 'moment';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

type Props = {
    className?: string;
};

// @FIXME: can't automatically set parent height https://github.com/fullcalendar/fullcalendar/issues/4650
const CalendarWrapper: React.FC<Props> = ({ className }) => {
    const calendar = useRef<FullCalendar>(null);
    const [height, setHeight] = useState(500);

    const measuredRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            // @FIXME: Can't get height due to Suspense https://github.com/facebook/react/issues/14536
            setTimeout(() => {
                setHeight(node ? node.getBoundingClientRect().height : 0);
            }, 500);
        }
    }, []);

    /**
     * TODO:
     * 1. Different titles for different views: on day: Today, October 3, on week: 7-14 Oct, on month: October, 2019
     * 2. Add and style more views
     * 3. On day click, open a pop-up to create the event
     */

    return (
        <Wrapper className={className} ref={measuredRef}>
            <FullCalendar
                events={[{ title: 'event 1', date: '2019-10-06' }, { title: 'event 2', date: '2019-10-02' }]}
                ref={calendar}
                height={height}
                header={{ left: 'prev,next', center: 'title', right: 'dayGridMonth' }}
                titleFormat={{ year: 'numeric', month: 'long' }}
                columnHeaderHtml={col => {
                    if (moment(col).weekday() === moment().weekday()) {
                        return `<span class="current-day">${moment(col).format('ddd')}</span>`;
                    }
                    return moment(col).format('ddd');
                }}
                defaultView="dayGridMonth"
                plugins={[dayGridPlugin]}
            />
        </Wrapper>
    );
};

const fullCalendarStyles = theme('mode', {
    light: css`
        .fc-toolbar {
            .fc-button.fc-button-primary {
                ${tw`bg-transparent hover:bg-primary-300 active:bg-primary-400 
                    text-gray-800 hover:text-gray-800 active:text-gray-800 
                    border-gray-400 hover:border-primary-400 focus:border-primary-200 
                    focus:shadow-outline py-2 px-8`}
            }
        }
        .fc {
            table {
                th,
                td {
                    ${tw`border-none`}
                }
                .fc-head {
                    th {
                        ${tw`py-4 uppercase text-2xl text-gray-500`}

                        .current-day {
                            ${tw`text-primary-500 font-medium`}
                            text-shadow: 0 1px 1px #f6e05e;
                        }
                    }
                }
                .fc-body {
                    table {
                        ${tw`border-separate`}
                        border-spacing: 1em 0;

                        td {
                            ${tw`border-t-4 border-gray-300`}
                        }
                    }

                    .fc-day,
                    .fc-today {
                        border-top-style: solid;
                    }

                    .fc-today {
                        ${tw`bg-transparent border-primary-400 text-primary-600`}
                    }
                }
            }
        }
    `,
});

const Wrapper = styled.div`
    height: 100%;

    ${fullCalendarStyles}
`;

export default CalendarWrapper;
