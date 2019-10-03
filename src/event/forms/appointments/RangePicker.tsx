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

// @FIXME: start date starts on the next day with multiple inputs
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

    const blockWeekends = (day: moment.Moment): boolean => {
        const num = moment(day).weekday();

        if (num === 0 || num === 6) {
            return true;
        }

        return false;
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
                isDayBlocked={blockWeekends}
            />
            <div className="flex mt3">
                <div className="mr3">
                    <label className="db fw4 lh-copy f5" htmlFor={`start-${id}`}>
                        Start Time
                    </label>
                    <input
                        type="time"
                        className="border-box pa2 input-reset ba bg-transparent"
                        name="startTime"
                        id={`start-${id}`}
                        value={startTime.format('HH:mm')}
                        onChange={handleInputTimeChanges}
                    />
                </div>
                <div className="mr3">
                    <label className="db fw4 lh-copy f5" htmlFor={`end-${id}`}>
                        End Time
                    </label>
                    <input
                        type="time"
                        className="border-box pa2 input-reset ba bg-transparent"
                        name="endTime"
                        id={`end-${id}`}
                        value={endTime.format('HH:mm')}
                        onChange={handleInputTimeChanges}
                    />
                </div>
            </div>
            <div className="mt3">
                <label className="db fw4 lh-copy f5" htmlFor={`length-${id}`}>
                    Length (in minutes)
                </label>
                <input
                    type="number"
                    className="border-box pa2 input-reset ba bg-transparent w4"
                    min="0"
                    max="59"
                    name="length"
                    id={`length-${id}`}
                    value={length}
                    onChange={handleInputTimeChanges}
                />
            </div>
            {canDelete && (
                <div className="mv3">
                    <button className="bn ph3 pv2 mb2 dib white bg-dark-red" onClick={handleRemoveClick}>
                        Delete?
                    </button>
                </div>
            )}
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
                .minute(0)
                .second(0)
                .millisecond(0),
            endTime: moment()
                .hours(17)
                .minute(0)
                .second(0)
                .millisecond(0),
            startDate: null,
            endDate: null,
            length: 20,
        },
    ]);

    const addDateRange = (): void => {
        id.current++;
        const prevEndDate = dateRanges[dateRanges.length - 1].endDate;
        const entry = {
            ...dateRanges[dateRanges.length - 1],
            id: id.current,
            startDate: prevEndDate ? moment(prevEndDate).add(1, 'day') : null,
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
        const start = startDate ? moment(startDate).startOf('day') : null;
        const end = endDate ? moment(endDate).endOf('day') : null;

        setDateRanges(
            dateRanges.map(range => (range.id === id ? { ...range, startDate: start, endDate: end } : range)),
        );
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
        <article className="ba b--black-10 pa3 ma2">
            <h1 className="f4 ttu tracked">Select the Date Range</h1>
            {dateRanges.map(date => (
                <Picker
                    key={date.id}
                    startId="startDate"
                    endId="endDate"
                    handleDateChanges={onDatesChanges(date.id)}
                    onInputTimeChanges={onInputTimeChanges(date.id)}
                    canDelete={dateRanges.length > 1}
                    removeDateRange={removeDateRange}
                    id={date.id}
                    {...date}
                />
            ))}
            {dateRanges[dateRanges.length - 1].endDate && (
                <div className="mv3">
                    <button className="dib black" onClick={addDateRange}>
                        Add Date Range
                    </button>
                </div>
            )}
            <div className="mt3">
                <Link className="link underline-hover black" onClick={handleSubmit} to="../4">
                    Next
                </Link>
            </div>
        </article>
    );
};

export { RangePicker };
