import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { SlotsByDate } from 'calendar/types';
import { FormWrapper, FormTitle, StyledLink, ButtonWrapper } from 'shared/inputs';

type Props = {
    slots: SlotsByDate;
    handleSubmit: (e: React.MouseEvent) => void;
};

const Review: React.FC<Props> = ({ slots, handleSubmit }) => {
    return (
        <FormWrapper>
            <FormTitle>Review Your Plan</FormTitle>
            {slots &&
                Object.keys(slots).map(slotId => (
                    <div key={slotId}>
                        <SubTitle>{slotId}</SubTitle>
                        {Object.values(slots[slotId]).map(({ start, end }) => {
                            return (
                                <div key={start.toLocaleString()}>
                                    {moment(start).format('h:mm a')} - {moment(end).format('h:mm a')}
                                </div>
                            );
                        })}
                    </div>
                ))}
            <ButtonWrapper>
                <StyledLink to="/events" onClick={handleSubmit}>
                    Submit
                </StyledLink>
            </ButtonWrapper>
        </FormWrapper>
    );
};

const SubTitle = styled.h2`
    ${tw`text-gray-700 mb-2`}
`;

export { Review as AppointmentSlotsReview };
