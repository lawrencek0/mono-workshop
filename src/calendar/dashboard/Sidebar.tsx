import React from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { Menu, MenuLink, MenuButton } from '@reach/menu-button';
import { StyledMenuList } from 'navigation/Navbar';
import { Link } from '@reach/router';
import { FaCaretDown } from 'react-icons/fa';
import Card, { Props as Appointment } from '../../shared/cards/Appointment';

type Props = {
    appointments: Appointment[];
    className?: string;
};

const NewEvent: React.FC<{}> = () => {
    return (
        <Menu>
            <StyledMenuBtn>
                Create New
                <FaCaretDown />
            </StyledMenuBtn>
            <StyledMenuList>
                <MenuLink as={(Link as unknown) as string} to="appointments/new/1">
                    Appointment
                </MenuLink>
            </StyledMenuList>
        </Menu>
    );
};

const Sidebar: React.FC<Props> = ({ className, appointments }) => {
    if (!appointments) return <>Loading</>;
    return (
        <Wrapper className={className}>
            <Title>Events</Title>
            <NewEvent />
            {appointments.map(appointment => (
                <Card key={appointment.start.toString()} {...appointment} />
            ))}
        </Wrapper>
    );
};

const StyledMenuBtn = styled(MenuButton)`
    ${tw`flex items-center font-light mb-4`}
`;

const Title = styled.h1`
    ${tw`font-bold text-3xl mb-2`}
`;

const Wrapper = styled.div`
    ${tw`flex flex-col px-8 overflow-y-scroll`}
`;

export default Sidebar;
