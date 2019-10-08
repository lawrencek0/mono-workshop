import moment from 'moment';
import { Slot, SlotsByDate } from './AppointmentSlotsReview';
import { DateTimeRange } from './RangePicker';

const generateSlots = (start: moment.Moment, length: number, duration: number): Slot[] => {
    return Array.from({ length }, (_, i) => {
        const slotStart = moment(start).add(i * duration, 'm');
        const slotEnd = moment(slotStart).add(duration, 'm');
        return {
            start: slotStart.toDate(),
            end: slotEnd.toDate(),
        };
    });
};

const slotsFromRanges = (dateRanges: DateTimeRange[]): Slot[][] => {
    return dateRanges.reduce<Slot[][]>((acc, { startDate, endDate, startTime, endTime, length }) => {
        if (startDate && endDate && startTime && endTime && length) {
            const days = moment(endDate).diff(startDate, 'days') + 1;
            const hours = moment(endTime).diff(startTime, 'hours');
            const startHour = moment(startTime).get('hours');
            const numOfSlots = Math.ceil((hours * 60) / length);
            Array(days)
                .fill(0)
                .forEach((_, i) => {
                    const day = moment(startDate)
                        .add(i, 'days')
                        .add(startHour, 'hours');
                    const slots = generateSlots(day, numOfSlots, length);
                    acc.push(slots);
                });
            return acc;
        }
        return acc;
    }, []);
};

const slotsByDay = (allSlots: Slot[][]): SlotsByDate => {
    return allSlots.reduce<SlotsByDate>((acc, slots) => {
        const start = moment(slots[0].start).format('YYYY/MM/DD');
        if (!acc[start]) {
            acc[start] = [];
        }
        acc[start] = [...acc[start], ...slots];
        return acc;
    }, {});
};

export { generateSlots, slotsFromRanges, slotsByDay };
