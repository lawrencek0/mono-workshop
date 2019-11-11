import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { FormTitle } from 'shared/inputs/styles';
import { SlotsByDate } from 'calendar/types';

type Props = {
    slots: SlotsByDate;
};

const Review: React.FC<Props> = ({ slots }) => {
    return (
        <>
            <FormTitle>Review Your Plan</FormTitle>
            {slots &&
                Object.keys(slots).map(slotId => (
                    <div key={slotId}>
                        <SubTitle>{slotId}</SubTitle>
                        {Object.values(slots[slotId]).map(({ start, end }) => {
                            return (
                                <div key={moment(start).toLocaleString()}>
                                    {moment(start).format('h:mm a')} - {moment(end).format('h:mm a')}
                                </div>
                            );
                        })}
                    </div>
                ))}
        </>
    );
};

const SubTitle = styled.h2`
    ${tw`text-gray-700 mb-2`}
`;

export { Review as AppointmentSlotsReview };
