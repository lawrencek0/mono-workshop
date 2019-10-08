import React, { useState } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components';
import { RouteComponentProps, navigate } from '@reach/router';
import { useEventState, SlotModel } from 'calendar/hooks';
import moment from 'moment';
import { useAuthState } from 'auth/hooks';
import { apiClient } from 'utils/api-client';

type Props = RouteComponentProps & {
    slotId?: string;
};

const renderForFaculty = (slots: SlotModel[]): React.ReactNode => {
    return slots.map(slot => {
        return (
            <div key={slot.id}>
                {moment(slot.start).toLocaleString()} - {moment(slot.end).toLocaleString()}
            </div>
        );
    });
};

const StudentSelect: React.FC<{ slots: SlotModel[]; studentId?: string }> = ({ slots, studentId }) => {
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
                        {moment(slot.start).toLocaleString()} - {moment(slot.end).toLocaleString()}
                    </label>
                </div>
            ))}
            <input type="submit" value="Select" />
        </form>
    );
};

const Select: React.FC<Props> = ({ slotId }) => {
    const {
        appointment: [{ slots }],
    } = useEventState();
    const { id, role } = useAuthState();
    return (
        <Wrapper>
            {role === 'faculty' && renderForFaculty(slots)}
            <StudentSelect studentId={id!.toLocaleString()} slots={slots} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex flex-col`}
`;

export default Select;
