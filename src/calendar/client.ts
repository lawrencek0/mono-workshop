import { apiClient } from 'utils/api-client';
import { Student } from 'utils/students-client';
import { Slot, Appointment } from './types';

type Payload = {
    students: Pick<Student, 'id'>[];
    slots: Slot[];
    title: string;
    description: string;
};

const createAppointment = async (payload: Payload): Promise<Payload> => {
    const res: Payload = await apiClient('appointments', { body: payload });
    return res;
};

const fetchAppointments = async (): Promise<Required<Appointment>[]> => {
    const { appointments } = await apiClient('appointments');
    return appointments;
};

const fetchSlots = async (detailId: string): Promise<Required<Slot>[]> => {
    const { slots } = await apiClient(`appointments/${detailId}`);
    return slots;
};

export { createAppointment, fetchAppointments, fetchSlots };
