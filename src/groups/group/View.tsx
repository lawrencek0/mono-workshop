import React from 'react';
import { useCache } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
import { Props } from './Page';

export const View: React.FC<Props> = ({ groupId }) => {
    const group = useCache(GroupResource.detailShape(), { id: groupId });

    if (!group) return <>Loading</>;

    return (
        <>
            <div>{group.name}</div>
        </>
    );
};
