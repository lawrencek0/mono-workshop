import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled, { css, ThemeProvider } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import moment from 'moment';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import { OptionsInput } from '@fullcalendar/core';

type Variant = 'flat' | 'raised';
type Props = OptionsInput &
    any & {
        className?: string;
        variant?: Variant;
    };

// @FIXME: can't automatically set parent height https://github.com/fullcalendar/fullcalendar/issues/4650
const CalendarWrapper: React.FC<Props> = ({ className, selectedAppointment, variant = 'flat' }) => {
    const calendar = useRef<FullCalendar>(null);
    const [height, setHeight] = useState(500);

    const measuredRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            // @FIXME: Can't get height due to Suspense https://github.com/facebook/react/issues/14536
            setTimeout(() => {
                setHeight(node ? node.getBoundingClientRect().height : 0);
            }, 1000);
        }
    }, []);

    const eventLimitText = (eventCnt: number): string => {
        // if (isMobile) {
        //     return '.'.repeat(eventCnt);
        // }
        return '+ ' + eventCnt + ' more events';
    };

    /**
     * TODO:
     * 1. Different titles for different views: on day: Today, October 3, on week: 7-14 Oct, on month: October, 2019
     * 2. Add and style more views
     * 3. On day click, open a pop-up to create the event
     */

    return (
        <ThemeProvider theme={{ variant }}>
            <Wrapper className={className} ref={measuredRef}>
                <FullCalendar
                    events={selectedAppointment}
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
                    eventLimit={true}
                    eventLimitText={eventLimitText}
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                />
            </Wrapper>
        </ThemeProvider>
    );
};

const fullCalendarStyles = theme('variant', {
    card: css`
        .fc {
            table {
                ${tw`text-center`}
                th,
                td {
                    /* removes all borders */
                    ${tw`border-none`}
                }

                .fc-day-top {
                    & > .fc-day-number {
                        /* needed for centering the day number */
                        ${tw`float-none inline-block`}
                    }
                }

                .fc-more-cell {
                    .fc-more {
                        /* for styling the more events from eventLimit */
                        ${tw`inline-block w-2/3 mx-auto h-2 rounded bg-blue-400`}
                    }
                }

                .fc-today {
                    ${tw`bg-transparent border-primary-400 text-primary-600`}
                }
            }
            .fc-toolbar {
                ${tw`mb-4`}

                .fc-button {
                    /* remove styling from the calendar control buttons */
                    ${tw`bg-transparent border-0 text-gray-500`}
                }

                h2 {
                    /* styles the calendar title */
                    ${tw`text-xl font-bold`}
                }
            }
        }
    `,
    flat: css`
        .fc {
            table {
                th,
                td {
                    ${tw`border-none`}
                }
                .fc-toolbar {
                    .fc-button.fc-button-primary {
                        ${tw`bg-transparent hover:bg-primary-300 active:bg-primary-400 
                    text-gray-800 hover:text-gray-800 active:text-gray-800 
                    border-gray-400 hover:border-primary-400 focus:border-primary-200 
                    focus:shadow-outline py-2 px-8`}
                    }
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

                    .fc-day-top,
                    .fc-today {
                        border-top-style: solid;
                    }

                    .fc-today {
                        ${tw`bg-transparent border-primary-400 text-primary-600`}
                    }

                    .fc-event {
                        ${tw`bg-white border-l-4 truncate rounded cursor-pointer px-2 mb-2 border-gray-400 text-gray-800`}
                    }
                }
            }
        }
    `,
});

const Wrapper = styled.div<{ variant?: Variant }>`
    height: 100%;

    ${fullCalendarStyles}
`;

Wrapper.defaultProps = {
    variant: 'flat',
};

export default CalendarWrapper;
