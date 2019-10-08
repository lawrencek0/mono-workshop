import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import moment from 'moment';
import { Student } from 'calendar/forms/appointments/StudentSelection';
import { FaBookReader } from 'react-icons/fa';
import { Link } from '@reach/router';

type Slot = {
    start?: moment.Moment;
    end?: moment.Moment;
};

type Faculty = Omit<Student, 'selected'>;

export type Props = Slot & {
    type: 'appointment';
    id: string;
    title: string;
    description: string;
    faculty?: Faculty;
    location?: string;
    color?: string;
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

const Card: React.FC<Props> = ({ type, id, title, description, start, end, faculty, location, color }) => {
    return (
        <Wrapper color={color}>
            <Title>{title}</Title>
            <Body>
                {description}
                {renderTimeSlot({ start, end })}
                {location && <div>At: {location}</div>}
                {faculty && renderFacultyAvatar(faculty)}
            </Body>
            <Footer>
                <DetailsLink to={`${type}/${id}`}>Details</DetailsLink>
            </Footer>
        </Wrapper>
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

const Wrapper = styled.div<{ color?: string }>`
    ${tw`flex flex-col justify-between py-4 px-8 mb-4 leading-normal shadow-md
        border border-gray-400 rounded border-l-8`}
    border-left-color: ${props => props.color}
`;

const Title = styled.h1`
    ${tw`text-gray-900 font-medium text-lg mb-2`}
`;

const Body = styled.p`
    ${tw`text-gray-700 text-sm`}
`;

const Footer = styled.div`
    ${tw`mt-4 uppercase tracking-wide text-base text-gray-600`}
`;

const DetailsLink = styled(Link)`
    ${tw`border-gray-400 border-2 hover:bg-gray-200 py-2 px-4`}
`;

export default Card;
