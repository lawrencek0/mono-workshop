import React from 'react';
import { useResource } from 'rest-hooks';
import { EventResource } from 'resources/EventResource';
import { Props } from './Page';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import moment from 'moment';
import { StyledTitle, Item } from 'groups/group/Page';
import { Separator } from 'calendar/dashboard/Modal';
import { Link } from '@reach/router';
import { Avatar } from 'calendar/appointment/create/StudentSelection';
import { FaUserCircle } from 'react-icons/fa';

export const View: React.FC<Props> = ({ eventId }) => {
    const { title, description, start, end, eventRoster } = useResource(EventResource.detailShape(), { id: eventId });
    return (
        <div>
            <StyledTitle>{title}</StyledTitle>
            {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
            <div>Start: {moment(start).format('YYYY/MM/DD hh:mm')}</div>
            <div>End: {moment(end).format('YYYY/MM/DD hh:mm')}</div>
            <Separator css={tw`my-4`} aria-hidden />
            <Members>
                <h3>Members</h3>
                {eventRoster &&
                    eventRoster.map(user => (
                        <Link key={user.id} to={`/users/${user.id}`}>
                            <Item css={tw`flex`}>
                                <span css={tw`ml-2 mr-4`}>
                                    {user.picUrl ? (
                                        <Avatar css={tw`w-12 h-12`} src={user.picUrl} />
                                    ) : (
                                        <FaUserCircle css={tw`w-12 h-12`} />
                                    )}
                                </span>
                                <div>
                                    <div>
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div css={tw`capitalize font-light`}>{user.role}</div>
                                </div>
                            </Item>
                        </Link>
                    ))}
            </Members>
        </div>
    );
};

const Members = styled.div`
    ${tw`my-4`}
`;
