import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import { FaUserCircle, FaUsers } from 'react-icons/fa';
import { UserResource } from 'resources/UserResource';
import { Avatar } from 'calendar/appointment/create/StudentSelection';
import { GroupResource } from 'resources/GroupResource';
import { getName } from 'calendar/helpers';

const Items: React.FC<{
    downshift: ControllerStateAndHelpers<UserResource | GroupResource>;
    selectedUsers: UserResource[];
    selectedGroups: GroupResource[];
}> = ({ downshift: { inputValue, getItemProps, highlightedIndex, itemToString }, selectedUsers, selectedGroups }) => {
    // @TODO: add endpoint to search by name instead
    const users = useResource(UserResource.listByRole(), { role: 'student' });
    const groups = useResource(GroupResource.listShape(), {});
    const combined = useMemo(() => [...users, ...groups], [groups, users]);

    const filterItem = (item: UserResource | GroupResource): boolean => {
        if (inputValue) {
            const term = inputValue.toLowerCase();
            if (item instanceof UserResource) {
                return item.firstName.toLowerCase().includes(term) || item.lastName.toLowerCase().includes(term);
            }
            return item.name.toLowerCase().includes(term);
        }
        return false;
    };

    return (
        <>
            {combined.filter(filterItem).map((item, index) => (
                <Item
                    key={{}}
                    css={tw`flex items-center`}
                    {...getItemProps({
                        key:
                            item instanceof UserResource
                                ? `${item.firstName} ${item.lastName}`
                                : item instanceof GroupResource
                                ? item.name
                                : '',
                        index,
                        item,
                        style: {
                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight:
                                selectedUsers.find(selectedUser => selectedUser.id === item.id) ||
                                selectedGroups.find(selectedGroup => selectedGroup.id === item.id)
                                    ? 'bold'
                                    : 'normal',
                        },
                    })}
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
                    {itemToString(item)}
                </Item>
            ))}
        </>
    );
};

export const DropdownSelect: React.FC<{
    users: UserResource[];
    groups: GroupResource[];
    setGroups: React.Dispatch<React.SetStateAction<GroupResource[]>>;
    setUsers: React.Dispatch<React.SetStateAction<UserResource[]>>;
    className?: string;
}> = ({ users, groups, setGroups, setUsers, className }) => {
    return (
        <Downshift
            onChange={(selectedItem: UserResource | GroupResource, stateAndHelpers) => {
                const item =
                    selectedItem instanceof UserResource
                        ? users.find(user => user.id === selectedItem.id)
                        : groups.find(group => group.id === selectedItem.id);

                if (item instanceof UserResource) {
                    return setUsers(users.filter(user => user.id !== selectedItem.id));
                }

                if (selectedItem instanceof UserResource) {
                    return setUsers([...users, selectedItem]);
                }

                if (item instanceof GroupResource) {
                    return setGroups(groups.filter(group => group.id !== selectedItem.id));
                }

                return setGroups([...groups, selectedItem]);
            }}
            itemToString={getName}
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
                                <Items downshift={props} selectedGroups={groups} selectedUsers={users} />
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
