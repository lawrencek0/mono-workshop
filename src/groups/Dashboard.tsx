import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { useResource } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
import { Wrapper as Card, Title } from 'shared/cards/styles';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { media } from 'theme';

export const Dashboard: React.FC<RouteComponentProps> = () => {
    const groups = useResource(GroupResource.listShape(), {});

    return (
        <Wrapper>
            <Card>Groups here</Card>
            <Card as="aside">
                <Title>Groups</Title>
                {groups.map(({ id, name }) => (
                    <Link css={tw`capitalize`} key={id} to={`./${id}`}>
                        {name}
                    </Link>
                ))}
            </Card>
        </Wrapper>
    );
};

export const Wrapper = styled.div`
    ${tw`flex flex-col mx-auto lg:w-2/3`}

    ${media.tablet} {
        display: grid;
        grid-template-columns: 1fr minmax(min-content, 25%);
        grid-gap: 2em;
    }
`;
