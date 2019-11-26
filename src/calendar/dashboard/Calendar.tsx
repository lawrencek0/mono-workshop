import React, { useState, useRef, useLayoutEffect, forwardRef } from 'react';
import styled, { css, ThemeProvider } from 'styled-components/macro';
import theme from 'styled-theming';
import tw from 'tailwind.macro';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { OptionsInput } from '@fullcalendar/core';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import { textColor } from 'themes/theme';

type Variant = 'flat' | 'raised';
type Props = OptionsInput & {
    calendarRef?: React.RefObject<FullCalendar>;
    className?: string;
    variant?: Variant;
    height?: number;
};

const CalendarWrapper = forwardRef<FullCalendar, Props>(
    (
        {
            events,
            className,
            header = { left: 'prev,next', center: 'title', right: 'dayGridMonth' },
            defaultView = 'dayGridMonth',
            variant = 'flat',
            height: passedHeight = -1,
            ...props
        },
        ref,
    ) => {
        const [height, setHeight] = useState(passedHeight);
        const wrapperRef = useRef<HTMLDivElement>(null);

        // @FIXME: hack cuz https://github.com/fullcalendar/fullcalendar/issues/4650
        useLayoutEffect(() => {
            if (passedHeight === -1) {
                (async (): Promise<void> => {
                    while (!wrapperRef.current || wrapperRef.current.getBoundingClientRect().height === 0) {
                        await new Promise(resolve => requestAnimationFrame(resolve));
                    }

                    if (wrapperRef.current) {
                        const bounds = await wrapperRef.current.getBoundingClientRect();
                        setHeight(bounds.height);
                    }
                })();
            }
        }, [wrapperRef, passedHeight]);

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
                <Wrapper ref={wrapperRef} className={className}>
                    <FullCalendar
                        ref={ref}
                        events={events}
                        height={height}
                        header={header}
                        titleFormat={{ year: 'numeric', month: 'long' }}
                        columnHeaderHtml={col => {
                            if (moment(col).weekday() === moment().weekday()) {
                                return `<span class="current-day">${moment(col).format('ddd')}</span>`;
                            }
                            return moment(col).format('ddd');
                        }}
                        select={e => console.log(e)}
                        eventLimit={true}
                        eventLimitText={eventLimitText}
                        defaultView={defaultView}
                        plugins={[interactionPlugin, dayGridPlugin]}
                        {...props}
                    />
                </Wrapper>
            </ThemeProvider>
        );
    },
);

CalendarWrapper.displayName = 'CalendarWrapper';

const fullCalendarStyles = theme('variant', {
    raised: css`
        ${tw`rounded shadow`}
        background: var(--color-bg-card);

        .fc {
            ${tw`px-2 py-2`}
            table {
                ${tw`text-center`}
                th,
                td {
                    /* removes all borders */
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
            .fc-toolbar {
                .fc-button.fc-button-primary {
                    ${tw`text-gray-800 hover:text-gray-800 active:text-gray-800 
                    border-gray-500 hover:border-primary-600 focus:border-primary-600 
                    focus:shadow-outline py-2 px-8 uppercase`}
                    background: transparent;
                    color: ${textColor};
                }
            }
            table {
                th,
                td {
                    ${tw`border-none`}
                }
                .fc-head {
                    th {
                        ${tw`py-4 uppercase text-2xl text-gray-500`}

                        .current-day {
                            ${tw`text-gray-700 font-medium`}
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
                        ${tw`border-primary-400 text-primary-600`}
                        background: transparent;
                    }

                    .fc-event {
                        ${tw`border-l-4 truncate rounded cursor-pointer px-2 mb-2 border-gray-400 text-gray-800`}
                        background: var(--color-bg-card);
                    }
                }
            }
        }
    `,
});

const Wrapper = styled.div`
    ${tw`h-full`}

    ${fullCalendarStyles}
`;

export default CalendarWrapper;
