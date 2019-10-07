import React, { lazy, useRef, useState, useEffect } from 'react';
import { RouteComponentProps, Link, Router } from '@reach/router';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';
import Dashboard from './dashboard/Dashboard';

const EventForm = lazy(() => import('./forms/appointments/AppointmentForm'));

const Dropdown: React.FC<{ className?: string }> = ({ className }) => {
    const node = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const handleClickOutside = (e: MouseEvent): void => {
        if (node.current && node.current.contains(e.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div className={className} role="listbox" ref={node} aria-expanded={open} aria-label="Create New Event">
            <button onClick={_e => setOpen(!open)}>+ New</button>
            {open && (
                <ul>
                    <li role="option" aria-selected={false}>
                        <Link to="add/appointment/1">Appointment</Link>
                    </li>
                    <li role="option" aria-selected={false}>
                        <Link to="add/event">Events</Link>
                    </li>
                    <li role="option" aria-selected={false}>
                        <Link to="add/reminder">Reminder</Link>
                    </li>
                </ul>
            )}
        </div>
    );
};

const Event: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <StyledRouter>
                <RouteGuard as={Dashboard} action="events:visit" path="/"></RouteGuard>
                <RouteGuard as={EventForm} action="events:add" path="appointment/new/:step"></RouteGuard>
            </StyledRouter>
        </Main>
    );
};

const StyledRouter = styled(Router)`
    ${tw`h-full`}
`;

export default Event;
