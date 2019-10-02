import React, { lazy, useRef, useState, useEffect } from 'react';
import { RouteComponentProps, Link, Router } from '@reach/router';
import { Main } from 'navigation/Main';
import { RouteGuard } from 'routing/PrivateRoute';

const EventForm = lazy(() => import('./AppointmentForm'));

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

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <div className="flex">
            <div className="f1">Events</div>
            <div className="ml-auto">
                <Dropdown />
            </div>
        </div>
    );
};

const Event: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Router>
                <RouteGuard as={Page} action="events:visit" path="/"></RouteGuard>
                <RouteGuard as={EventForm} action="events:add" path="add/appointment/:step"></RouteGuard>
            </Router>
        </Main>
    );
};

export default Event;
