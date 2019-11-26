import React from 'react';
import { useResource } from 'rest-hooks';
import { GroupUserResource, GroupResource } from 'resources/GroupResource';
import { Props, StyledTitle } from './Page';
import { Table } from './Table';
import { StyledWrapper } from './View';

export const Members: React.FC<Props> = ({ groupId }) => {
    const [users, { user }] = useResource(
        [GroupUserResource.listShape(), { groupId }],
        [GroupResource.detailShape(), { id: groupId }],
    );

    if (!user || !user.role) {
        return <>Loading</>;
    }

    return (
        <StyledWrapper>
            <StyledTitle>Members</StyledTitle>
            <Table groupId={groupId} users={users} canModify={user.role === 'owner'}></Table>
        </StyledWrapper>
    );
};
