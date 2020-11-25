import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { useResource } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { FormWrapper } from 'shared/inputs/styles';
import { StyledTitle } from './group/Page';

export const Dashboard: React.FC<RouteComponentProps> = () => {
    const groups = useResource(GroupResource.listShape(), {});

    return (
        <FormWrapper>
            <StyledTitle>Groups</StyledTitle>
            {groups.length > 0 ? (
                groups.map(({ id, name, description }) => (
                    <Link css={tw`capitalize`} key={id} to={`./${id}`}>
                        <Wrapper>
                            <GroupTitle>{name}</GroupTitle>
                            {description && <Content dangerouslySetInnerHTML={{ __html: description }} />}
                        </Wrapper>
                    </Link>
                ))
            ) : (
                <p css={tw`text-center`}>You are not in any groups! The horror!</p>
            )}
        </FormWrapper>
    );
};

const Wrapper = styled.div`
    ${tw`w-full px-2 py-4 hover:bg-gray-300`}
`;

const GroupTitle = styled.h2`
    ${tw`font-bold`}
`;

const Content = styled.p`
    ${tw`text-base`}
`;
