import React, { Suspense } from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import { FaUserCircle } from 'react-icons/fa';
import { UserResource } from 'resources/UserResource';
import { Avatar } from 'calendar/appointment/create/StudentSelection';

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
                            <FaUserCircle css={tw`w-6 h-6 ml-2 mr-4`} />
                        )}
                        {itemToString(item)}
                    </Item>
                ))}
        </>
    );
};

export const DropdownSelect: React.FC<{
    users: InstanceType<typeof UserResource>[];
    setUsers: React.Dispatch<React.SetStateAction<InstanceType<typeof UserResource>[]>>;
    className?: string;
}> = ({ users, setUsers, className }) => {
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
                <div className={className}>
                    <input
                        css={tw`hover:bg-gray-300 hover:border-gray-500 focus:border-gray-800 focus:bg-gray-300 px-2 pt-2 w-full border-b-2 border-b-2 border-transparent`}
                        {...props.getInputProps({
                            placeholder: 'Add people',
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

export const Menu = styled.ul`
    ${tw`absolute shadow rounded w-9/12`}
    max-height: 20em;
`;

export const Item = styled.li`
    ${tw`px-2 py-4 block cursor-pointer`}
`;
