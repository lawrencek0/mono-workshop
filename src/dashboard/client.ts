import { apiClient } from 'utils/api-client';
import { Detail, Appointment } from 'calendar/types';

const fetchUntakenAppointments = async (): Promise<Appointment[]> => {
    const { appointments } = await apiClient('appointments/untaken');
    return appointments.map((appointment: Required<Detail>) => ({ ...appointment, type: 'appointments' }));
};

export { fetchUntakenAppointments };
