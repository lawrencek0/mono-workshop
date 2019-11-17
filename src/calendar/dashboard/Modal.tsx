import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { Formik, Form } from 'formik';
import { Link } from '@reach/router';
import { FaUserFriends } from 'react-icons/fa';

type Props = {
    position?: { left?: number; top?: number };
};

export const Modal: React.FC<Props> = ({ position }) => {
    if (!position) {
        return <></>;
    }

    const handleSubmit = (): void => {
        /* TODO */
    };
    return createPortal(
        <Wrapper aria-modal={true} tabIndex={-1} {...position}>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                <Form>
                    <StyledLink to="./appointments/new/1">
                        <StyledIcon
                            as={FaUserFriends}
                            aria-label="Create Appointment"
                            aria-labelledby="create-appointment"
                        />
                        <span id="create-appointment">Appointment</span>
                    </StyledLink>
                </Form>
            </Formik>
        </Wrapper>,
        document.body,
    );
};

const Wrapper = styled.aside<{ left?: number; top?: number }>`
    ${tw`absolute bg-white rounded w-2/12 h-32 px-8 py-4 text-center z-10 shadow-lg`};
    display: ${props => (props.left ? 'block' : 'none')};
    left: ${props => `${props.left}px`};
    top: ${props => `${props.top}px`};
`;

const StyledLink = styled(Link)`
    ${tw`flex flex-col items-center text-gray-700`}
`;

const StyledIcon = styled.div`
    ${tw`text-5xl`}
`;
