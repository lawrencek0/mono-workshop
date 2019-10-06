import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled, { css } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import moment from 'moment';

const Dashboard: React.FC<{}> = () => {
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
     *
     */

    return (
        <Wrapper ref={measuredRef}>
            <FullCalendar
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
            th {
                ${tw`border-none py-8 uppercase text-2xl text-gray-500`}

                .current-day {
                    ${tw`text-primary-500 font-medium`}
                    text-shadow: 0 1px 1px #f6e05e;
                }
            }
            th,
            td {
                border-left: none;
                border-right: none;
            }
        }
    `,
});

const Wrapper = styled.div`
    height: 100%;

    ${fullCalendarStyles}
`;

export default Dashboard;
