import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useResource } from 'rest-hooks';
import { GroupEventResource } from 'resources/GroupResource';
import { StyledWrapper } from 'groups/group/View';
import { StyledTitle } from 'groups/group/Page';

export const View: React.FC<RouteComponentProps & { groupId?: string; eventId?: string }> = ({ groupId, eventId }) => {
    const event = useResource(GroupEventResource.detailShape(), { groupId, id: eventId });

    return (
        <StyledWrapper>
            <StyledTitle>{event.title}</StyledTitle>
            {event.description && <p dangerouslySetInnerHTML={{ __html: event.description }} />}
        </StyledWrapper>
    );
};
