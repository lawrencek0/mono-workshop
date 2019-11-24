import React, { useMemo } from 'react';
import { useCache, useResource } from 'rest-hooks';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { GroupResource, GroupUserResource } from 'resources/GroupResource';
import { Wrapper } from 'shared/cards/styles';
import { Props, StyledTitle } from './Page';
import { UserResource } from 'resources/UserResource';
import { Item } from 'calendar/dashboard/Items';
import { Avatar } from 'calendar/appointment/create/StudentSelection';
import { FaUserCircle } from 'react-icons/fa';
import { FaExclamation } from 'react-icons/fa';
import { Link } from '@reach/router';
import { media } from 'theme';
import { ErrorMessage } from 'auth/Login';

export const View: React.FC<Props> = ({ groupId }) => {
    const group = useCache(GroupResource.detailShape(), { id: groupId });

    if (!group) return <>Loading</>;

    return (
        <>
            <div>{group.name}</div>
        </>
    );
};

export const UnauthenticatedView: React.FC<{ groupId?: string }> = ({ groupId }) => {
    const [group, members] = useResource(
        [GroupResource.detailShape(), { id: groupId }],
        [GroupUserResource.listShape(), { groupId }],
    );
    const impMembers = useMemo(() => members.filter(({ role }) => role !== 'member'), [members]);

    return (
        <Wrapper css={tw`m-auto lg:w-9/12 xl:w-7/12`}>
            <ErrorMessage css={tw`text-xl`}>
                <FaExclamation css={tw`inline`} />
                You are not in this group
            </ErrorMessage>
            <StyledTitle>{group.name}</StyledTitle>
            <Content>
                <p>{group.description || 'No description has been provided for this group'}</p>
                <div css={tw`lg:border-l-2`}>
                    <h3 css={tw`text-center text-xl`}>Members</h3>
                    {impMembers.map(member => (
                        <User key={member.id} {...member} />
                    ))}
                </div>
            </Content>
        </Wrapper>
    );
};

function User<T extends UserResource | GroupUserResource>(item: T): React.ReactElement {
    return (
        <Link to={`/users/${item.id}`}>
            <Item css={tw`flex`}>
                <span css={tw`ml-2 mr-4`}>
                    {item.picUrl ? (
                        <Avatar css={tw`w-12 h-12`} src={item.picUrl} />
                    ) : (
                        <FaUserCircle css={tw`w-12 h-12`} />
                    )}
                </span>
                <div>
                    <div>
                        {item.firstName} {item.lastName}
                    </div>
                    <div css={tw`capitalize font-light`}>{item.role}</div>
                </div>
            </Item>
        </Link>
    );
}

const Content = styled.div`
    ${tw`flex flex-col items-center`}

    ${media.tablet} {
        display: grid;
        grid-template-columns: 1fr minmax(min-content, 35%);
        justify-items: center;
        grid-gap: 1em;
    }
`;
