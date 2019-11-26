import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { useResource } from 'rest-hooks';
import { GroupEventResource, GroupResource } from 'resources/GroupResource';
import { StyledWrapper } from 'groups/group/View';
import { StyledTitle } from 'groups/group/Page';
import moment from 'moment';

export const View: React.FC<RouteComponentProps & { groupId?: string; eventId?: string }> = ({ groupId, eventId }) => {
    const [event, { user }] = useResource(
        [GroupEventResource.detailShape(), { groupId, id: eventId }],
        [GroupResource.detailShape(), { id: groupId }],
    );
    return (
        <StyledWrapper>
            <StyledTitle>{event.title}</StyledTitle>
            {event.description && <p dangerouslySetInnerHTML={{ __html: event.description }} />}
            <div>Start: {moment(event.start).format('YYYY/MM/DD hh:mm')}</div>
            <div>End: {moment(event.end).format('YYYY/MM/DD hh:mm')}</div>
            {user && user.role !== 'member' && (
                <div>
                    <Link to="./edit">Edit Event</Link>
                </div>
            )}
        </StyledWrapper>
    );
};
