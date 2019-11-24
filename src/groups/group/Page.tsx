import React from 'react';
import { RouteComponentProps, Link, Match, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
import theme from 'styled-theming';
import { Wrapper } from '../Dashboard';
import { Title } from 'shared/cards/styles';
import { RouteGuard } from 'routing/PrivateRoute';
import { Members } from './Members';
import { View, UnauthenticatedView } from './View';

export type Props = RouteComponentProps & {
    groupId?: string;
};

export const Group: React.FC<RouteComponentProps & { groupId?: string }> = ({ groupId }) => {
    const group = useResource(GroupResource.detailShape(), { id: groupId });

    if (!group.user) {
        return <UnauthenticatedView groupId={groupId} />;
    }

    return (
        <Wrapper>
            <Router>
                <RouteGuard as={View} path="/" action="groups:visit" />
                <RouteGuard as={Members} path="/members" action="groups:visit" />
            </Router>
            <Sidebar name={group.name} />
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

const Sidebar: React.FC<{ name: string }> = ({ name }) => {
    return (
        <aside>
            <StyledTitle>{name}</StyledTitle>
            <ul>
                <Item>
                    <NavLink to="./">Home</NavLink>
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
