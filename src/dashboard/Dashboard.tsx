import React, { useMemo } from 'react';
import { useResource } from 'rest-hooks';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { RouteComponentProps, Link } from '@reach/router';
import { useAuthState } from 'auth/hooks';
import { Main } from 'navigation/Main';
import Card from 'shared/cards/Appointment';
import { AppointmentResource } from 'resources/AppointmentResource';
import { GroupEventResource } from 'resources/GroupResource';
import { EventResource } from 'resources/EventResource';
import { Wrapper as CardWrapper, StyledLink } from 'shared/cards/styles';
import { StyledTitle } from 'groups/group/Page';
import moment from 'moment';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const StudentDashboard: React.FC<{}> = () => {
    const untakenAppointments = useResource(AppointmentResource.listByUntaken(), {});

    if (untakenAppointments.length === 0) {
        return <></>;
    }

    return (
        <>
            <StyledTitle css={tw`text-left ml-4`}>Untaken Appointments</StyledTitle>
            <Wrapper>
                {untakenAppointments.map(event => {
                    return <Card key={event.id} {...event} type="appointments" color="red" />;
                })}
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    ${tw`flex flex-wrap content-around`}
    > div {
        ${tw`ml-4 w-full md:w-1/2 lg:w-1/5 xl:w-1/4`}
    }
`;

const Dashboard: React.FC<RouteComponentProps> = () => {
    const {
        user: { role },
    } = useAuthState();
    const [groups, events] = useResource([GroupEventResource.fetchAll(), {}], [EventResource.listShape(), {}]);
    const newGroups = groups.filter(e => moment().isBefore(moment(e.start)));
    const newEvents = events.filter(e => moment().isBefore(moment(e.start)));

    const allEvents = useMemo(
        () =>
            [...newGroups, ...newEvents].sort((a, b) => {
                return moment(a.start).diff(moment(b.start));
            }),
        [newGroups, newEvents],
    );

    return (
        <Main>
            <div>
                {allEvents.map(event => {
                    const link =
                        event instanceof GroupEventResource && event.group
                            ? `/group/${event.group.id}/events/${event.id}`
                            : `/calendar/events/${event.id}`;
                    return (
                        <Link key={link} to={link}>
                            <Div>
                                <StyledTitle>{event.title}</StyledTitle>
                                {event.description && (
                                    <p css={tw`text-xl`} dangerouslySetInnerHTML={{ __html: event.description }}></p>
                                )}
                            </Div>
                        </Link>
                    );
                })}
            </div>
            {role === 'student' && <StudentDashboard />}
            {newGroups.length > 0 && (
                <>
                    <StyledTitle css={tw`text-left ml-4`}>Group Events</StyledTitle>
                    <Wrapper>
                        {newGroups.slice(0, 5).map(event => {
                            const groupId = event && event.group ? event.group.id : undefined;
                            return (
                                <CardWrapper key={event.id}>
                                    <StyledTitle>{event.title}</StyledTitle>
                                    {event.description && <p dangerouslySetInnerHTML={{ __html: event.description }} />}
                                    {groupId && (
                                        <StyledLink to={`/groups/${groupId}/events/${event.id}`}>Details</StyledLink>
                                    )}
                                </CardWrapper>
                            );
                        })}
                    </Wrapper>
                </>
            )}
            {newEvents.length > 0 && (
                <>
                    <StyledTitle css={tw`text-left ml-4`}>Events</StyledTitle>
                    <Wrapper>
                        {events
                            .filter(e => moment().isBefore(moment(e.start)))
                            .slice(0, 5)
                            .map(event => {
                                return (
                                    <CardWrapper key={event.id}>
                                        <StyledTitle>{event.title}</StyledTitle>
                                        {event.description && (
                                            <p dangerouslySetInnerHTML={{ __html: event.description }} />
                                        )}
                                        <StyledLink to={`/calendar/events/${event.id}`}>Details</StyledLink>
                                    </CardWrapper>
                                );
                            })}
                    </Wrapper>
                </>
            )}
        </Main>
    );
};

const Div = styled.div`
    background: var(--color-bg-card);

    line-height: 100px;
    margin: 10px;
    padding: 2%;
    position: relative;
    text-align: center;
`;

export { Dashboard };
