import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import { FaBookReader } from 'react-icons/fa';
import { Link } from '@reach/router';
import { Wrapper, Title, Body, Footer, StyledLink } from './styles';
import { AppointmentResource } from 'resources/AppointmentResource';
import { UserResource } from 'resources/UserResource';

export type Props = InstanceType<typeof AppointmentResource> & {
    type: 'appointments';
    color: string;
    className?: string;
};

const renderFacultyAvatar = ({ id, firstName, lastName }: InstanceType<typeof UserResource>): React.ReactElement => {
    return (
        <AvatarWrapper>
            <AvatarLink to={`/faculty/${id}`}>
                <Avatar />
                <FacultyName>
                    {firstName} {lastName}
                </FacultyName>
            </AvatarLink>
        </AvatarWrapper>
    );
};

const Card: React.FC<Props> = ({ type, id, title, description, faculty, color, className }) => {
    return (
        <StyledWrapper className={className} color={color}>
            <Title>{title}</Title>
            <Body>
                {description}
                {faculty && renderFacultyAvatar(faculty)}
            </Body>
            <Footer>
                <StyledLink to={`calendar/${type}/${id}`}>Details</StyledLink>
            </Footer>
        </StyledWrapper>
    );
};

const Avatar = styled(FaBookReader)`
    ${tw`text-2xl`}
`;

const AvatarLink = styled(Link)`
    ${tw`flex items-center hover:underline`}
`;

const FacultyName = styled.div`
    ${tw`pl-4`}
`;

const AvatarWrapper = styled.div`
    ${tw`flex items-center mt-4`}
`;

const StyledWrapper = styled(Wrapper)<{ color?: string }>`
    ${tw`border border-gray-400 border-l-8`}
    border-left-color: ${props => props.color}
`;

export default Card;
