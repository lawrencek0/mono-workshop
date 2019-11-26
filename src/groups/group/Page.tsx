import React, { lazy, Suspense } from 'react';
import { RouteComponentProps, Link, Match, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import { GroupResource, GroupUserResource } from 'resources/GroupResource';
import theme from 'styled-theming';
import { Title } from 'shared/cards/styles';
import { RouteGuard } from 'routing/PrivateRoute';
import { Members } from './Members';
import { View, UnauthenticatedView } from './View';
import { media } from 'themes/theme';

export type Props = RouteComponentProps & {
    groupId?: string;
};

const PostCreationForm = lazy(() => import('groups/posts/Create'));
const Events = lazy(() => import('groups/events/Page'));
const GroupEditForm = lazy(() => import('./Edit'));

export const Group: React.FC<RouteComponentProps & { groupId?: string }> = ({ groupId }) => {
    const group = useResource(GroupResource.detailShape(), { id: groupId });

    if (!group.user) {
        return <UnauthenticatedView groupId={groupId} />;
    }

    return (
        <Wrapper>
            <StyledTitle
                css={`
                    ${tw`order-1 lg:order-none`}
                    grid-column-start: 2;
                `}
            >
                {group.name}
            </StyledTitle>
            <div css="grid-row-start: 1">
                <Suspense fallback={<div>Loading your group...</div>}>
                    <Router>
                        <RouteGuard as={View} path="/" action="groups:visit" />
                        <RouteGuard as={Members} path="/members" action="groups:visit" />
                        <RouteGuard as={PostCreationForm} path="/posts/new" action="groups:visit" />
                        <Events path="/events/*" />
                        <RouteGuard as={GroupEditForm} path="/edit" action="groups:visit" />
                    </Router>
                </Suspense>
            </div>
            <Sidebar user={group.user} />
        </Wrapper>
    );
};

export const NavLink: React.FC<{ to: string; children: React.ReactChild }> = ({ to, children }) => (
    <Match path={to}>
        {({ match }) => (
            <StyledLink to={to} variant={match ? 'active' : 'default'}>
                {children}
            </StyledLink>
        )}
    </Match>
);

const Sidebar: React.FC<{ user: GroupUserResource }> = ({ user: { role } }) => {
    return (
        <aside
            css={`
                grid-row-start: 2;
                grid-column-start: 2;
            `}
        >
            <ul>
                <Item>
                    <NavLink to="./">Home</NavLink>
                </Item>
                <Item>
                    <NavLink to="./posts/new">Create Post</NavLink>
                </Item>
                {role !== 'member' && (
                    <Item>
                        <NavLink to="./events/new">Create Event</NavLink>
                    </Item>
                )}
                <Item>
                    <NavLink to="./members">Members</NavLink>
                </Item>
                {role !== 'member' && (
                    <Item>
                        <NavLink to="./edit">Edit</NavLink>
                    </Item>
                )}
            </ul>
        </aside>
    );
};

export const StyledTitle = styled(Title)`
    ${tw`text-center text-3xl`}
`;

const Wrapper = styled.div`
    ${tw`flex flex-col-reverse mx-auto lg:w-2/3`}

    ${media.tablet} {
        display: grid;
        grid-template-columns: 1fr minmax(min-content, 25%);
        grid-template-rows: 200px repeat(2, auto);
        grid-gap: 2em;
    }
`;

export const Item = styled.li`
    ${tw`my-4`}
`;

const styles = theme.variants('mode', 'variant', {
    active: {
        light: tw`bg-gray-200 text-gray-800 font-semibold`,
    },
});

const StyledLink = styled(Link)<{ variant: 'active' | 'default' }>`
    ${tw`block w-full py-2 px-4 text-gray-700 hover:bg-gray-400`}

    ${styles};
`;
