import React, { forwardRef, useState, Suspense } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { useResource } from 'rest-hooks';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import { FaHeading } from 'react-icons/fa';
import { FaAlignLeft } from 'react-icons/fa';
import { FaCalendarWeek } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaMinusCircle } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { PrimaryButton, FlatButton } from 'shared/buttons';
import { UserResource } from 'resources/UserResource';
import { Avatar } from 'calendar/appointment/create/StudentSelection';

type EventType = 'appointment';

export type Position = { left?: number; top?: number };

export type Props = {
    position?: Position;
    type?: EventType;
    startDate?: moment.Moment;
};

const Items: React.FC<{
    downshift: ControllerStateAndHelpers<InstanceType<typeof UserResource>>;
    selectedUsers: InstanceType<typeof UserResource>[];
}> = ({ downshift: { inputValue, getItemProps, highlightedIndex, itemToString }, selectedUsers }) => {
    // @TODO: add endpoint to search by name instead
    const users = useResource(UserResource.listByRole(), { role: 'student' });

    return (
        <>
            {users
                .filter(item => !inputValue || item.firstName.toLowerCase().includes(inputValue.toLowerCase()))
                .map((item, index) => (
                    <Item
                        key={{}}
                        css={tw`flex items-center`}
                        {...getItemProps({
                            key: `${item.firstName} ${item.lastName}`,
                            index,
                            item,
                            style: {
                                backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                fontWeight: selectedUsers.find(selectedUser => selectedUser.id === item.id)
                                    ? 'bold'
                                    : 'normal',
                            },
                        })}
                    >
                        {item.picUrl ? (
                            <Avatar css={tw`w-6 h-6 ml-2 mr-4`} src={item.picUrl} />
                        ) : (
                            <FaUserCircle size="3em" />
                        )}
                        {itemToString(item)}
                    </Item>
                ))}
        </>
    );
};

const DropdownSelect: React.FC<{
    users: InstanceType<typeof UserResource>[];
    setUsers: React.Dispatch<React.SetStateAction<InstanceType<typeof UserResource>[]>>;
}> = ({ users, setUsers }) => {
    return (
        <Downshift
            onChange={(selectedItem: InstanceType<typeof UserResource>, stateAndHelpers) => {
                const item = users.find(user => user.id === selectedItem.id);

                if (item) {
                    setUsers(users.filter(user => user.id !== selectedItem.id));
                } else {
                    setUsers([...users, selectedItem]);
                }
            }}
            itemToString={(i: InstanceType<typeof UserResource>): string => (i ? `${i.firstName} ${i.lastName}` : '')}
            stateReducer={(state, changes) => {
                switch (changes.type) {
                    case Downshift.stateChangeTypes.keyDownEnter:
                    case Downshift.stateChangeTypes.clickItem:
                        return {
                            ...changes,
                            isOpen: false,
                            highlightedIndex: state.highlightedIndex,
                            inputValue: '',
                        };

                    default:
                        return changes;
                }
            }}
            selectedItem={null}
        >
            {props => (
                <div>
                    <input
                        css={tw`hover:bg-gray-300 hover:border-gray-500 focus:border-gray-800 focus:bg-gray-300 px-2 pt-2 w-full border-b-2 border-b-2 border-transparent`}
                        {...props.getInputProps({
                            placeholder: 'Add guests',
                        })}
                    />
                    <Menu
                        {...props.getMenuProps({
                            'aria-label': 'Search users and groups',
                        })}
                    >
                        {props.isOpen ? (
                            <Suspense fallback={<Item>Searching...</Item>}>
                                <Items downshift={props} selectedUsers={users} />
                            </Suspense>
                        ) : null}
                    </Menu>
                </div>
            )}
        </Downshift>
    );
};

const Menu = styled.ul`
    ${tw`absolute shadow rounded w-9/12`}
    max-height: 20em;
`;

const Item = styled.li`
    ${tw`px-2 py-4 block cursor-pointer`}
`;

export const Modal = forwardRef<HTMLElement, Props>(
    ({ position, type: eventType = 'appointment', startDate = moment() }, ref) => {
        const [type, setType] = useState<EventType>(eventType);
        const [selectedUsers, setSelectedUsers] = useState<InstanceType<typeof UserResource>[]>([]);

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
                            {/* TODO: Focus with react-focus-trap */}
                            <StyledField
                                css={tw`text-2xl`}
                                name="title"
                                placeholder="Enter the title"
                                aria-label="Title"
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
                            <Separator aria-hidden />
                            <StyledIcon as={FaUsers} aria-hidden />
                            <DropdownSelect users={selectedUsers} setUsers={setSelectedUsers} />
                            <div css="grid-column-start: 2">
                                {selectedUsers.map(user => (
                                    <div
                                        css={tw`flex items-center rounded py-2 border-2 border-transparent hover:border-gray-400 w-full `}
                                        key={user.id}
                                    >
                                        {user.picUrl ? (
                                            <Avatar css={tw`w-6 h-6 ml-2 mr-4`} src={user.picUrl} />
                                        ) : (
                                            <FaUserCircle size="3em" />
                                        )}
                                        <div>
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <FaMinusCircle
                                            onClick={() =>
                                                setSelectedUsers(
                                                    selectedUsers.filter(selectedUser => selectedUser.id !== user.id),
                                                )
                                            }
                                            css={tw`text-gray-600 hover:text-gray-800 ml-auto mr-4 cursor-pointer`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Separator aria-hidden />
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

const StyledField = styled(Field)`
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

const Separator = styled.div`
    ${tw`bg-gray-200 w-full`}
    grid-column: span 2;
    height: 2px;
`;

const StyledIcon = styled.div`
    ${tw`text-xl`}
`;
