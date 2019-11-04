import moment from 'moment';
import { Slot, SlotsByDate } from 'calendar/types';
import { DatetimeRange } from './appointment/create/Form';

const generateSlots = (start: moment.Moment, length: number, duration: number): Required<Omit<Slot, 'id'>>[] => {
    return Array.from({ length }, (_, i) => {
        const slotStart = moment(start).add(i * duration, 'm');
        const slotEnd = moment(slotStart).add(duration, 'm');
        return {
            start: slotStart,
            end: slotEnd,
        };
    });
};

const slotsFromRanges = (dateRanges: DatetimeRange['datetimeRanges']): Required<Omit<Slot, 'id'>>[] => {
    return dateRanges.flatMap(({ startDate, endDate, times, length }) => {
        if (startDate && endDate && times && length) {
            const days = moment(endDate).diff(startDate, 'days') + 1;
            const slots = Array(days)
                .fill(0)
                .flatMap((_, i) => {
                    return times.flatMap<Slot>(({ startTime, endTime }) => {
                        const day = moment(startDate)
                            .add(i, 'days')
                            .add(moment(startTime, 'HH:mm').hours(), 'h');
                        const hours = moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), 'm');
                        const numOfSlots = Math.ceil(hours / length);
                        return generateSlots(day, numOfSlots, length);
                    });
                });

            return slots;
        }
        return [];
    });
};

const slotsByDay = (allSlots: Required<Omit<Slot, 'id'>>[]): SlotsByDate => {
    return allSlots.reduce<SlotsByDate>((acc, slots) => {
        const start = moment(slots.start).format('YYYY/MM/DD');
        if (!acc[start]) {
            acc[start] = [];
        }
        acc[start].push(slots);
        return acc;
    }, {});
};

export { generateSlots, slotsFromRanges, slotsByDay };
