import React from 'react';
import { Link } from '@reach/router';
import moment from 'moment';
import { Slot } from 'calendar/types';

export type SlotsByDate = {
    [key: string]: Required<Omit<Slot, 'id'>>[];
};

type Props = {
    slots: SlotsByDate;
    handleSubmit: (e: React.MouseEvent) => void;
};

const Review: React.FC<Props> = ({ slots, handleSubmit }) => {
    return (
        <article className="ba b--black-10 pa3 ma2">
            <h1 className="f4 ttu tracked">Review Your Plan</h1>
            {slots &&
                Object.keys(slots).map(slotId => (
                    <div key={slotId}>
                        {slotId}
                        {Object.values(slots[slotId]).map(({ start, end }) => {
                            return (
                                <div key={start.toLocaleString()}>
                                    {moment(start).format('h:mm a')} - {moment(end).format('h:mm a')}
                                </div>
                            );
                        })}
                    </div>
                ))}
            <div className="mt3">
                <Link className="link underline-hover black" to="/events" onClick={handleSubmit}>
                    Submit
                </Link>
            </div>
        </article>
    );
};

export { Review as AppointmentSlotsReview };
