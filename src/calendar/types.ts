import moment from 'moment';
import { Student as StudentBase } from 'utils/students-client';

export type Slot = {
    id?: string;
    start: moment.Moment;
    end: moment.Moment;
};

export type SlotsByDate = {
    [key: string]: Slot[];
};

export type Detail = {
    id?: string;
    title: string;
    description: string;
    student?: StudentBase;
};

export type Appointment = Slot & Detail;

export type DateTimeRange = {
    id: number;
    startTime: moment.Moment;
    endTime: moment.Moment;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    length?: number;
};

export type Student = StudentBase & {
    selected?: boolean;
};

export type Faculty = StudentBase;
