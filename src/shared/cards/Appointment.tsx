import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import moment from 'moment';
import { FaBookReader } from 'react-icons/fa';
import { Link } from '@reach/router';
import { Slot, Faculty } from 'calendar/types';
import { Wrapper, Title, Body, Footer, StyledLink } from './styles';

export type Props = Required<Slot> & {
    type: 'appointments';
    id: string;
    title: string;
    description: string;
    faculty?: Faculty;
    location?: string;
    color?: string;
    className?: string;
};

const renderFacultyAvatar = ({ id, firstName, lastName }: Faculty): JSX.Element => {
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

const renderTimeSlot = ({ start, end }: Slot): JSX.Element => {
    if (start && end) {
        return (
            <div>
                <time dateTime={moment(start).toLocaleString()}>{moment(start).format('hh:MM A')}</time> -{' '}
                <time dateTime={moment(end).toLocaleString()}>{moment(end).format('hh:MM A')}</time>
            </div>
        );
    }
    if (start) {
        return (
            <div>
                Start: <time dateTime={moment(start).toLocaleString()}>{moment(start).format('hh:MM A')}</time>
            </div>
        );
    }
    return <></>;
};

const Card: React.FC<Props> = ({ type, id, title, description, start, end, faculty, location, color, className }) => {
    return (
        <StyledWrapper className={className} color={color}>
            <Title>{title}</Title>
            <Body>
                {description}
                {renderTimeSlot({ start, end })}
                {location && <div>At: {location}</div>}
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
