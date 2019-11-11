import moment from 'moment';
import { SlotResource } from 'resources/AppointmentResource';

export type SlotsByDate = {
    [key: string]: InstanceType<typeof SlotResource>[];
};

export type DateTimeRange = {
    id: number;
    times: {
        id: number;
        startTime: moment.Moment;
        endTime: moment.Moment;
    }[];
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    length?: number;
};
