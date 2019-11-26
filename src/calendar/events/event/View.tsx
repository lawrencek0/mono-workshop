import React from 'react';
import { useResource } from 'rest-hooks';
import { EventResource } from 'resources/EventResource';
import { Props } from './Page';
import moment from 'moment';

export const View: React.FC<Props> = ({ eventId }) => {
    const { title, description, start, end } = useResource(EventResource.detailShape(), { id: eventId });

    return (
        <div>
            {title}
            {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
            <div>Start: {moment(start).format('YYYY/MM/DD hh:mm')}</div>
            <div>End: {moment(end).format('YYYY/MM/DD hh:mm')}</div>
        </div>
    );
};
