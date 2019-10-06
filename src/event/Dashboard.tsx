import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled from 'styled-components/macro';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

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

    return (
        <Wrapper ref={measuredRef}>
            <FullCalendar
                ref={calendar}
                height={height}
                header={{ left: 'prev,next', center: 'title', right: '' }}
                defaultView="dayGridMonth"
                plugins={[dayGridPlugin]}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    height: 100%;
`;

export default Dashboard;
