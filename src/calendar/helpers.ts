import moment from 'moment';
import { SlotsByDate } from 'calendar/types';
import { DatetimeRange } from './appointment/create/Form';
import { SlotResource } from 'resources/AppointmentResource';
import { UserResource } from 'resources/UserResource';
import { GroupResource } from 'resources/GroupResource';

const getDate = (
    date: moment.MomentInput = moment(),
    hour: number = moment().hours(),
    minutes: number = moment().minutes(),
): moment.Moment => {
    return moment(date)
        .hours(moment(hour).hours())
        .minutes(moment(minutes).minutes())
        .seconds(0)
        .milliseconds(0);
};

const generateSlots = (start: moment.Moment, length: number, duration: number): InstanceType<typeof SlotResource>[] => {
    return Array.from({ length }, (_, i) => {
        const slotStart = moment(start).add(i * duration, 'm');
        const slotEnd = moment(slotStart).add(duration, 'm');

        return SlotResource.fromJS({
            start: slotStart,
            end: slotEnd,
        });
    });
};

const slotsFromRanges = (dateRanges: DatetimeRange['datetimeRanges']): InstanceType<typeof SlotResource>[] => {
    return dateRanges.flatMap(({ startDate, endDate, times, length }) => {
        if (startDate && endDate && times && length) {
            const days = moment(endDate).diff(startDate, 'days') + 1;
            return Array(days)
                .fill(0)
                .flatMap((_, i) => {
                    return times.flatMap<InstanceType<typeof SlotResource>>(({ startTime, endTime }) => {
                        const day = moment(startDate)
                            .add(i, 'days')
                            .add(moment(startTime, 'HH:mm').hours(), 'h');
                        const hours = moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), 'm');
                        const numOfSlots = Math.ceil(hours / length);
                        return generateSlots(day, numOfSlots, length);
                    });
                });
        }
        return [];
    });
};

const groupSlotsByDay = (allSlots: InstanceType<typeof SlotResource>[]): SlotsByDate => {
    return allSlots.reduce<SlotsByDate>((acc, slots) => {
        const start = moment(slots.start).format('YYYY/MM/DD');
        if (!acc[start]) {
            acc[start] = [];
        }
        acc[start].push(slots);
        return acc;
    }, {});
};

const getName = (i: UserResource | GroupResource): string => {
    if (i) {
        if (i instanceof UserResource) {
            return `${i.firstName} ${i.lastName}`;
        }
        return i.name;
    }
    return '';
};

export { getDate, generateSlots, slotsFromRanges, groupSlotsByDay, getName };
