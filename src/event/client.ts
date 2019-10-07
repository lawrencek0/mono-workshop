import { apiClient } from 'utils/api-client';
import { Student } from 'utils/students-client';
import { Slot } from './forms/appointments/AppointmentSlotsReview';
import { Appointment, State } from './hooks';

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

const fetchAppointments = async (): Promise<State> => {
    const { selectedAppointments, appointments } = await apiClient('appointments');
    return {
        appointment: appointments.map((appointment: Appointment) => ({ ...appointment, type: 'appointment' })),
        selectedAppointment: selectedAppointments.map((appointment: Appointment) => ({
            ...appointment,
            type: 'appointment',
        })),
    };
};

export { createAppointment, fetchAppointments };
