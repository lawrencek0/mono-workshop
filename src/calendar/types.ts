import moment from 'moment';

export type Slot = {
    id?: string;
    start?: moment.Moment;
    end?: moment.Moment;
};

export type Detail = {
    id?: string;
    title?: string;
    description?: string;
};

export type Appointment = Slot & Detail;
