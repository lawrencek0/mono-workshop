import React, { forwardRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import { Link } from '@reach/router';
import { FaHeading } from 'react-icons/fa';
import { FaAlignLeft } from 'react-icons/fa';
import { FaCalendarWeek } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { PrimaryButton, FlatButton } from 'shared/buttons';

type EventType = 'appointment';

export type Position = { left?: number; top?: number };

export type Props = {
    position?: Position;
    type?: EventType;
    startDate?: moment.Moment;
};

export const Modal = forwardRef<HTMLElement, Props>(
    ({ position, type: eventType = 'appointment', startDate = moment() }, ref) => {
        const [type, setType] = useState<EventType>(eventType);

        const handleTypeClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>): void => {
            const value = currentTarget.name as EventType;
            setType(value);
        };

        const handleSubmit = (): void => {
            /* TODO */
        };
        return createPortal(
            <Wrapper ref={ref} aria-modal={true} tabIndex={-1} {...position}>
                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                        startDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(startDate).format('YYYY-MM-DD'),
                        startTime: moment(startDate).format('HH:mm'),
                        endTime: moment(startDate)
                            .add(1, 'h')
                            .format('HH:mm'),
                    }}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <StyledForm autoComplete="off">
                            <StyledIcon as={FaHeading} aria-hidden />
                            <StyledField
                                css={tw`text-2xl`}
                                name="title"
                                placeholder="Enter the title"
                                aria-label="Title"
                                innerRef={(el: HTMLInputElement) => el && el.focus()}
                                required
                            />
                            <ButtonWrapper>
                                <StyledButton
                                    css={tw`bg-gray-200`}
                                    type="button"
                                    name="appointments"
                                    onClick={handleTypeClick}
                                    active={type === 'appointment'}
                                >
                                    Appointment
                                </StyledButton>
                            </ButtonWrapper>
                            <Separator />
                            <StyledIcon as={FaCalendarWeek} aria-hidden />
                            <div css={tw`flex`}>
                                <StyledField css={tw`mr-4`} type="date" name="startDate" aria-label="Start date" />
                                <StyledField min={values.startDate} type="date" name="endDate" aria-label="End date" />
                            </div>
                            <StyledIcon as={FaClock} aria-hidden />
                            <div css={tw`flex`}>
                                <StyledField css={tw`mr-4`} type="time" name="startTime" aria-label="Start time" />
                                <StyledField min={values.startTime} type="time" name="endTime" aria-label="End time" />
                            </div>
                            <Separator />
                            <StyledIcon as={FaUsers} aria-hidden />
                            <StyledField aria-label="Attendees" disabled value="TODO" />
                            <Separator />
                            <StyledIcon as={FaAlignLeft} aria-hidden />
                            <StyledField
                                as="textarea"
                                name="description"
                                placeholder="Enter the description"
                                aria-label="Description"
                            />
                            <ActionButtons>
                                <FlatButton css={tw`mr-4`} type="button">
                                    More Options
                                </FlatButton>
                                <PrimaryButton type="submit">Submit</PrimaryButton>
                            </ActionButtons>
                        </StyledForm>
                    )}
                </Formik>
            </Wrapper>,
            document.body,
        );
    },
);

Modal.displayName = 'Modal';

const Wrapper = styled.aside<{ left?: number; top?: number }>`
    ${tw`absolute bg-white rounded lg:w-4/12 xl:w-3/12 p-4 z-10 shadow-lg`};
    visibility: ${props => (props.left ? 'shown' : 'hidden')};
    left: ${props => `${props.left}px`};
    top: ${props => (props.top ? `${props.top}px` : 0)};
`;

const StyledForm = styled(Form)`
    display: grid;
    grid-template-columns: minmax(min-content, 36px) 1fr;
    grid-gap: 1em 0.5em;
    align-items: center;
`;

const StyledField = styled(Field)`
    ${tw`hover:bg-gray-300 focus:bg-gray-300 px-2 pt-2 w-full focus:border-b-2 border-gray-800`}
`;

const ButtonWrapper = styled.div`
    ${tw`flex`}
    grid-column-start: 2;
`;

const StyledButton = styled(FlatButton)<{ active: boolean }>`
    ${props => props.active && tw`bg-gray-200`};
`;

const ActionButtons = styled.div`
    ${tw`flex justify-end`}
    grid-column-start: 2;
`;

const Separator = styled.div`
    ${tw`bg-gray-200 w-full`}
    grid-column: span 2;
    height: 2px;
`;

const StyledLink = styled(Link)`
    ${tw`flex flex-col items-center text-gray-700`}
`;

const StyledIcon = styled.div`
    ${tw`text-xl`}
`;
