import React, { lazy, Suspense } from 'react';
import { RouteComponentProps, Link, Match, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
import theme from 'styled-theming';
import { Title } from 'shared/cards/styles';
import { RouteGuard } from 'routing/PrivateRoute';
import { Members } from './Members';
import { View, UnauthenticatedView } from './View';
import { media } from 'theme';

export type Props = RouteComponentProps & {
    groupId?: string;
};

const PostCreationFrom = lazy(() => import('groups/posts/Create'));

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
            <Suspense fallback={<div>Loading your group...</div>}>
                <Router>
                    <RouteGuard as={View} path="/" action="groups:visit" />
                    <RouteGuard as={Members} path="/members" action="groups:visit" />
                    <RouteGuard as={PostCreationFrom} path="/posts/new" action="groups:visit" />
                </Router>
            </Suspense>
            <Sidebar />
        </Wrapper>
    );
};

const NavLink: React.FC<{ to: string; children: React.ReactChild }> = ({ to, children }) => (
    <Match path={to}>
        {({ match }) => (
            <StyledLink to={to} variant={match ? 'active' : 'default'}>
                {children}
            </StyledLink>
        )}
    </Match>
);

const Sidebar: React.FC = () => {
    return (
        <aside>
            <ul>
                <Item>
                    <NavLink to="./">Home</NavLink>
                </Item>
                <Item>
                    <NavLink to="./posts/new">Create Post</NavLink>
                </Item>
                <Item>
                    <NavLink to="./members">Members</NavLink>
                </Item>
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
        grid-gap: 2em;
    }
`;

const Item = styled.li`
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
