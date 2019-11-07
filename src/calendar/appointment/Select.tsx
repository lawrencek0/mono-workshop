import React, { useState, useEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components';
import { RouteComponentProps, navigate } from '@reach/router';
import moment from 'moment';
import { useAuthState } from 'auth/hooks';
import { apiClient } from 'utils/api-client';
import { Slot } from 'calendar/types';
import { fetchSlots } from 'calendar/client';
import { UserPayload } from 'login/types';

type Props = RouteComponentProps & {
    detailId?: string;
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

const StudentSelect: React.FC<{ detailId: string; slots: Slot[]; studentId?: string }> = ({
    detailId,
    slots,
    studentId,
}) => {
    const [id, setId] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!id) {
            return;
        }

        // @TODO: using dispatch causes the same issue as in 'create_appointment' action i.e all data is fetched in calendar page
        await apiClient(`slots/${detailId}/${id}`, { method: 'PATCH', body: { studentId } });
        await navigate('/calendar');
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
                        {moment(slot.start).format('hh:mm A')} - {moment(slot.end).format('hh:mm A')}
                    </label>
                </div>
            ))}
            <input type="submit" value="Select" />
        </form>
    );
};

const Select: React.FC<Props> = ({ detailId }) => {
    const {
        user: { id, role },
    } = useAuthState() as Required<UserPayload>;
    const [slots, setSlots] = useState<Required<Slot>[]>([]);

    useEffect(() => {
        if (detailId) {
            const fetchData = async (): Promise<void> => {
                const appointmentSlots = await fetchSlots(detailId);
                setSlots(appointmentSlots);
            };
            fetchData();
        } else {
            navigate('./');
        }
    }, [detailId]);

    return (
        <Wrapper>
            {role === 'faculty'
                ? renderForFaculty(slots)
                : detailId && <StudentSelect detailId={detailId} studentId={id.toLocaleString()} slots={slots} />}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`flex flex-col`}
`;

export default Select;
