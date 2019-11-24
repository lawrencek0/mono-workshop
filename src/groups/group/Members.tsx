import React from 'react';
import { useResource } from 'rest-hooks';
import { GroupUserResource } from 'resources/GroupResource';
import { Props } from './Page';
import { Table } from './Table';

export const Members: React.FC<Props> = ({ groupId }) => {
    const users = useResource(GroupUserResource.listShape(), { groupId });
    if (!users) {
        return <div>No members!</div>;
    }
    return (
        <Table users={users} actions={<td>I love You</td>}>
            We will think
        </Table>
    );
};
