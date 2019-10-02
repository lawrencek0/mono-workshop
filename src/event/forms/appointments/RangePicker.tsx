import React, { useState, useRef } from 'react';
import { Link } from '@reach/router';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

export type DateTimeRange = {
    id: number;
    startTime: moment.Moment;
    endTime: moment.Moment;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    length?: number;
};

type PickerProps = DateTimeRange & {
    canDelete: boolean;
    startId: 'startDate';
    endId: 'endDate';
    handleDateChanges: ({ startDate, endDate }: Pick<DateTimeRange, 'startDate' | 'endDate'>) => void;
    onInputTimeChanges: (name: 'startTime' | 'endTime' | 'length', value: moment.Moment | number) => void;
    removeDateRange: (id: number) => void;
};

type RangePickerProps = {
    onSubmit: (dateRanges: DateTimeRange[]) => void;
};

const Picker: React.FC<PickerProps> = ({
    handleDateChanges,
    onInputTimeChanges,
    removeDateRange,
    id,
    startDate,
    endDate,
    startId,
    endId,
    canDelete,
    startTime,
    endTime,
    length,
}) => {
    const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

    const handleFocusChange = (focus: 'startDate' | 'endDate' | null): void => {
        setFocusedInput(focus);
    };

    const handleRemoveClick = (): void => {
        removeDateRange(id);
    };

    const handleInputTimeChanges = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        if (currentTarget.name === 'length') {
            const value = Number.parseInt(currentTarget.value, 10);
            onInputTimeChanges('length', value);
        } else if (currentTarget.name === 'startTime' || currentTarget.name === 'endTime') {
            const value = moment(currentTarget.value, 'HH:mm');
            onInputTimeChanges(currentTarget.name, value);
        }
    };

    return (
        <>
            <DateRangePicker
                onDatesChange={handleDateChanges}
                startDate={startDate}
                startDateId={startId}
                endDate={endDate}
                endDateId={endId}
                onFocusChange={handleFocusChange}
                focusedInput={focusedInput}
                minimumNights={0}
            />
            <label htmlFor={`start-${id}`}>Start Time</label>
            <input
                type="time"
                name="startTime"
                id={`start-${id}`}
                value={startTime.format('HH:mm')}
                onChange={handleInputTimeChanges}
            />
            <label htmlFor={`end-${id}`}>End Time</label>
            <input
                type="time"
                name="endTime"
                id={`end-${id}`}
                value={endTime.format('HH:mm')}
                onChange={handleInputTimeChanges}
            />
            <label htmlFor={`length-${id}`}>Length</label>
            <input
                type="number"
                min="0"
                max="59"
                name="length"
                id={`length-${id}`}
                value={length}
                onChange={handleInputTimeChanges}
            />
            {canDelete && <button onClick={handleRemoveClick}>-</button>}
        </>
    );
};

const RangePicker: React.FC<RangePickerProps> = ({ onSubmit }) => {
    const id = useRef(0);

    const [dateRanges, setDateRanges] = useState<DateTimeRange[]>([
        {
            id: id.current,
            startTime: moment()
                .hours(9)
                .minute(0),
            endTime: moment()
                .hours(17)
                .minute(0),
            startDate: null,
            endDate: null,
            length: 20,
        },
    ]);

    const addDateRange = (): void => {
        const entry = {
            ...dateRanges[dateRanges.length - 1],
            id: id.current,
            startDate: dateRanges[dateRanges.length - 1].endDate,
            endDate: null,
        };
        setDateRanges([...dateRanges, entry]);
    };

    const removeDateRange = (id: number): void => {
        setDateRanges(dateRanges.filter(range => range.id !== id));
    };

    const onDatesChanges = (id: number) => ({
        startDate,
        endDate,
    }: Pick<DateTimeRange, 'startDate' | 'endDate'>): void => {
        setDateRanges(dateRanges.map(range => (range.id === id ? { ...range, startDate, endDate } : range)));
    };

    const onInputTimeChanges = (id: number) => (
        name: 'startTime' | 'endTime' | 'length',
        value: moment.Moment | number,
    ): void => {
        setDateRanges(dateRanges.map(range => (range.id === id ? { ...range, [name]: value } : range)));
    };

    const handleSubmit = (_e: React.MouseEvent): void => {
        onSubmit(dateRanges);
    };

    return (
        <div>
            {dateRanges.map(date => (
                <Picker
                    key={date.id}
                    startId="startDate"
                    endId="endDate"
                    handleDateChanges={onDatesChanges(date.id)}
                    onInputTimeChanges={onInputTimeChanges(date.id)}
                    canDelete={dateRanges.length > 1}
                    removeDateRange={removeDateRange}
                    id={id.current}
                    {...date}
                />
            ))}
            {dateRanges[dateRanges.length - 1].endDate && <button onClick={addDateRange}>Add Date</button>}
            <Link onClick={handleSubmit} to="../4">
                Next
            </Link>
        </div>
    );
};

export { RangePicker };
