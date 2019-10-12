import React, { useState, useEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components';
import { RouteComponentProps, navigate } from '@reach/router';
import moment from 'moment';
import { useAuthState } from 'auth/hooks';
import { apiClient } from 'utils/api-client';
import { Slot } from 'calendar/types';
import { fetchSlots } from 'calendar/client';

type Props = RouteComponentProps & {
    slotId?: string;
};

const renderForFaculty = (slots: Slot[]): React.ReactNode => {
    return slots.map(slot => {
        return (
            <div key={slot.id}>
                {moment(slot.start).format('hh:mm A')} - {moment(slot.end).format('hh:MM A')}
            </div>
        );
    });
};

const StudentSelect: React.FC<{ slots: Slot[]; studentId?: string }> = ({ slots, studentId }) => {
    const [id, setId] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!id) {
            return;
        }
        try {
            const res = await apiClient(`slots/${id}`, { method: 'PATCH', body: { studentId } });
            navigate('/events');
            console.log(res);
        } catch (e) {
            alert(e);
        }
    };
    const handleChange = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setId(currentTarget.value);
    };
    return (
        <form onSubmit={handleSubmit}>
            {slots.map(slot => (
                <div key={slot.id}>
                    <input onChange={handleChange} type="radio" name="slot" value={slot.id} id={slot.id} />
                    <label htmlFor={slot.id}>
                        {moment(slot.start).format('hh:MM A')} - {moment(slot.end).format('hh:MM A')}
                    </label>
                </div>
            ))}
            <input type="submit" value="Select" />
        </form>
    );
};

const Select: React.FC<Props> = ({ slotId }) => {
    const { id, role } = useAuthState();
    const [slots, setSlots] = useState<Required<Slot>[]>([]);

    useEffect(() => {
        if (slotId) {
            const fetchData = async (): Promise<void> => {
                const appointmentSlots = await fetchSlots(slotId);
                setSlots(appointmentSlots);
            };
            fetchData();
        } else {
            navigate('./');
        }
    }, [slotId]);

    return (
        <Wrapper>
            {role === 'faculty' ? (
                renderForFaculty(slots)
            ) : (
                <StudentSelect studentId={id.toLocaleString()} slots={slots} />
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex flex-col`}
`;

export default Select;
