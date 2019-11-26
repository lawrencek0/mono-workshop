import React, { forwardRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { useFetcher, useResetter } from 'rest-hooks';
import { FaHeading } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { FaAlignLeft } from 'react-icons/fa';
import { FaCalendarWeek } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaMinusCircle } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { PrimaryButton, FlatButton } from 'shared/buttons';
import { UserResource } from 'resources/UserResource';
import { Avatar } from 'calendar/appointment/create/StudentSelection';
import { slotsFromRanges, getName } from 'calendar/helpers';
import { AppointmentResource } from 'resources/AppointmentResource';
import { StyledLink } from 'shared/cards/styles';
import { useAuthState } from 'auth/hooks';
import { DropdownSelect } from './Items';
import { GroupResource, GroupEventResource } from 'resources/GroupResource';
import { EventResource } from 'resources/EventResource';

type EventType = 'appointment' | 'event';

export type Position = { left?: number; top?: number };

export type Props = {
    position?: Position;
    type?: EventType;
    startDate?: moment.Moment;
    hideModal: () => void;
};

export const UserItems: React.FC<{
    items: (UserResource | GroupResource)[];
    deleteCb: (item: UserResource | GroupResource) => void;
}> = ({ items, deleteCb }) => {
    return (
        <>
            {items.map(item => (
                <div
                    css={tw`flex items-center rounded py-2 border-2 border-transparent hover:border-gray-400 w-full `}
                    key={item instanceof UserResource ? `${item.id}-${item.email}` : `${item.id}-${item.name}`}
                >
                    {item instanceof UserResource ? (
                        item.picUrl ? (
                            <Avatar css={tw`w-6 h-6 ml-2 mr-4`} src={(item as UserResource).picUrl} />
                        ) : (
                            <FaUserCircle css={tw`w-6 h-6 ml-2 mr-4`} />
                        )
                    ) : (
                        <FaUsers css={tw`w-6 h-6 m-2 mr-4`} />
                    )}
                    <div>{getName(item)}</div>
                    <FaMinusCircle
                        onClick={() => deleteCb(item)}
                        css={tw`text-gray-600 hover:text-gray-800 ml-auto mr-4 cursor-pointer`}
                    />
                </div>
            ))}
        </>
    );
};

export const Modal = forwardRef<HTMLElement, Props>(
    ({ position, hideModal, type: eventType = 'event', startDate = moment() }, ref) => {
        const {
            user: { role },
        } = useAuthState();
        const createAppointment = useFetcher(AppointmentResource.createShape());
        const createGroupEvent = useFetcher(GroupEventResource.createShape());
        const createEvent = useFetcher(EventResource.createShape());
        const [type, setType] = useState<EventType>(eventType);
        const [selectedUsers, setSelectedUsers] = useState<InstanceType<typeof UserResource>[]>([]);
        const [selectedGroups, setSelectedGroups] = useState<GroupResource[]>([]);
        const resetCache = useResetter();

        useEffect(() => {
            setSelectedUsers([]);
            setSelectedGroups([]);
            const handleClose = (e: KeyboardEvent): void => {
                if (e.key === 'Escape') {
                    hideModal();
                }
            };
            document.addEventListener('keydown', handleClose);

            if (!position) {
                return document.removeEventListener('keydown', handleClose);
            }

            return () => {
                document.removeEventListener('keydown', handleClose);
            };
        }, [position, hideModal]);

        const handleUserDelete = (item: UserResource | GroupResource): void => {
            if (item instanceof UserResource) {
                return setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== item.id));
            }

            return setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup.id !== item.id));
        };

        return createPortal(
            <Wrapper ref={ref} aria-modal={true} tabIndex={-1} {...position}>
                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                        location: '',
                        startDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(startDate).format('YYYY-MM-DD'),
                        startTime: moment(startDate).format('HH:mm'),
                        endTime: moment(startDate)
                            .add(1, 'h')
                            .format('HH:mm'),
                        length: 20,
                        color: '#FFF382',
                    }}
                    enableReinitialize
                    onSubmit={async values => {
                        if (type === 'appointment') {
                            const slots = slotsFromRanges([
                                {
                                    id: 0,
                                    startDate: values.startDate,
                                    endDate: values.endDate,
                                    times: [
                                        {
                                            id: 0,
                                            startTime: values.startTime,
                                            endTime: values.endTime,
                                        },
                                    ],
                                    length: values.length,
                                },
                            ]);

                            await createAppointment(
                                {},
                                {
                                    ...values,
                                    students: selectedUsers,
                                    slots,
                                },
                            );
                        }

                        if (type === 'event') {
                            const start = moment(values.startDate)
                                .add('hours', moment(values.startTime, 'HH:mm').hours())
                                .add('minutes', moment(values.startTime, 'HH:mm').minutes())
                                .toLocaleString();
                            const end = moment(values.endDate)
                                .add('hours', moment(values.endTime, 'HH:mm').hours())
                                .add('minutes', moment(values.endTime, 'HH:mm').minutes())
                                .toLocaleString();
                            moment(values.endDate)
                                .add('hours', moment(values.endTime, 'HH:mm').hours())
                                .add('minutes', moment(values.endTime, 'HH:mm').minutes())
                                .toLocaleString();

                            const groups =
                                selectedGroups.length > 0
                                    ? selectedGroups.map(({ id: groupId }) =>
                                          createGroupEvent(
                                              { groupId },
                                              {
                                                  ...values,
                                                  start,
                                                  end,
                                              },
                                              [
                                                  [
                                                      GroupEventResource.listShape(),
                                                      { groupId },
                                                      (groupId: string, groupIds: string[] | undefined) => [
                                                          groupId,
                                                          ...(groupIds || []),
                                                      ],
                                                  ],
                                              ],
                                          ),
                                      )
                                    : [];

                            const events =
                                selectedUsers.length > 0
                                    ? createEvent({}, { ...values, start, end, users: selectedUsers })
                                    : [];
                            await Promise.all([groups, events]);
                        }
                        await resetCache();
                        await hideModal();
                    }}
                >
                    {({ values }) => (
                        <StyledForm autoComplete="off">
                            <Cross onClick={() => hideModal()} />
                            <StyledIcon as={FaHeading} aria-hidden />
                            {/* TODO: Focus with react-focus-trap */}
                            <StyledField
                                css={tw`text-2xl`}
                                name="title"
                                placeholder="Enter the title"
                                aria-label="Title"
                            />
                            {role === 'faculty' && (
                                <ButtonWrapper>
                                    <StyledButton
                                        css={tw`mr-2`}
                                        type="button"
                                        onClick={() => setType('event')}
                                        active={type === 'event'}
                                    >
                                        Event
                                    </StyledButton>
                                    <StyledButton
                                        type="button"
                                        onClick={() => setType('appointment')}
                                        active={type === 'appointment'}
                                    >
                                        Appointment
                                    </StyledButton>
                                </ButtonWrapper>
                            )}
                            <Separator aria-hidden />
                            <StyledIcon as={FaCalendarWeek} aria-hidden />
                            <div css={tw`flex`}>
                                <StyledField css={tw`mr-4`} type="date" name="startDate" aria-label="Start date" />
                                <StyledField min={values.startDate} type="date" name="endDate" aria-label="End date" />
                            </div>
                            <StyledIcon as={FaClock} aria-hidden />
                            <div css={tw`flex`}>
                                <StyledField css={tw`mr-4`} type="time" name="startTime" aria-label="Start time" />
                                <StyledField type="time" name="endTime" aria-label="End time" />
                            </div>
                            {type === 'appointment' && (
                                <div css="grid-column-start: 2">
                                    <StyledField
                                        type="number"
                                        name="length"
                                        placeholder="Length of appointment"
                                        aria-label="Length of appointment"
                                    />
                                </div>
                            )}
                            <Separator aria-hidden />
                            <StyledIcon as={FaUsers} aria-hidden />
                            <DropdownSelect
                                groups={selectedGroups}
                                users={selectedUsers}
                                setUsers={setSelectedUsers}
                                setGroups={setSelectedGroups}
                            />
                            <div css="grid-column-start: 2">
                                <UserItems items={selectedUsers} deleteCb={handleUserDelete} />
                                <UserItems items={selectedGroups} deleteCb={handleUserDelete} />
                            </div>
                            <Separator aria-hidden />
                            <StyledIcon as={FaAlignLeft} aria-hidden />
                            <StyledField
                                as="textarea"
                                name="description"
                                placeholder="Enter the description"
                                aria-label="Description"
                            />
                            <div css="grid-column-start: 2">
                                <StyledField css={tw`w-16 h-8 p-2`} type="color" name="color" aria-label="Color" />
                            </div>
                            <ActionButtons>
                                {type === 'appointment' && (
                                    <StyledLink to="./appointments/new/1" css={tw`mr-4 border-0`}>
                                        More Options
                                    </StyledLink>
                                )}
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
    ${tw`absolute bg-white rounded p-4 z-10 shadow-lg`};
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

export const StyledField = styled(Field)`
    ${tw`hover:bg-gray-300 hover:border-gray-500 focus:border-gray-800 focus:bg-gray-300 px-2 pt-2 w-full border-b-2 border-b-2 border-transparent`}
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

const Cross = styled(FaTimesCircle)`
    ${tw`ml-auto cursor-pointer`}
    grid-column-start: 2
`;

export const Separator = styled.div`
    ${tw`bg-gray-200 w-full`}
    grid-column: span 2;
    height: 2px;
`;

export const StyledIcon = styled.div`
    ${tw`text-xl`}
`;
