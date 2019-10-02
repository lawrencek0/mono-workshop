import React from 'react';
import { Link } from '@reach/router';
import moment from 'moment';

export type Slot = {
    id?: string;
    start?: Date;
    end?: Date;
};

export type SlotsByDate = {
    [key: string]: Slot[];
};

type Props = {
    slots: SlotsByDate;
    onSubmit: (e: React.MouseEvent) => void;
};

const Review: React.FC<Props> = ({ slots, onSubmit }) => {
    return (
        <div>
            Review Your Plan
            {slots &&
                Object.keys(slots).map(slotId => (
                    <div key={slotId}>
                        {slotId}
                        {Object.values(slots[slotId]).map(({ start, id, end }) => {
                            if (start && id && end) {
                                return (
                                    <div key={id}>
                                        {moment(start).format('h:mm a')} - {moment(end).format('h:mm a')}
                                    </div>
                                );
                            }
                        })}
                    </div>
                ))}
            <Link to="/events" onClick={onSubmit}>
                Submit
            </Link>
        </div>
    );
};

export { Review as AppointmentSlotsReview };
