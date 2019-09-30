import React, { useState, useRef } from 'react';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import { apiClient } from 'utils/api-client';

type Props = RouteComponentProps & {
    step?: 1 | 2 | 3 | 4;
};
type DateTimeRange = {
    id: number;
    startTime: moment.Moment;
    endTime: moment.Moment;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    length?: number;
};
type Slot = {
    id?: string;
    start?: moment.Moment;
    end?: moment.Moment;
};
type PickerProps = DateTimeRange & {
    canDelete: boolean;
    startId: 'startDate';
    endId: 'endDate';
    handleDateChanges: ({ startDate, endDate }: Pick<DateTimeRange, 'startDate' | 'endDate'>) => void;
    onInputTimeChanges: (name: 'startTime' | 'endTime' | 'length', value: moment.Moment | number) => void;
    removeDateRange: (id: number) => void;
};

const Page: React.FC<Props> = ({ step = 1 }) => {
    const id = useRef(0);

    const [inputs, setInputs] = useState({
        title: '',
        description: '',
    });
    const [students, setStudents] = useState<
        {
            id: string;
            firstName: string;
            lastName: string;
            selected?: boolean;
        }[]
    >([
        {
            id: 'dfdas',
            firstName: 'dfasd',
            lastName: 'dfasda',
        },
        { id: 'afaf', firstName: 'dfasd', lastName: 'dfasda' },
    ]);
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
    const [slots, setSlots] = useState<{
        [key: string]: {
            [id: string]: Slot;
        };
    }>();

    const handleStudentSelection = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        const n = students.map(student => {
            if (student.id === currentTarget.name) {
                const selected = student.selected === undefined ? true : student.selected ? false : true;

                return {
                    ...student,
                    selected,
                };
            }
            return student;
        });
        setStudents(n);
    };

    const addDateRange = (): void => {
        id.current++;
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

    const handleInputChange = (name: 'title' | 'description', value: string): void => {
        setInputs(inputs => ({ ...inputs, [name]: value }));
    };

    const submitDates = (): void => {
        const dates = dateRanges.reduce<typeof slots>(
            (acc, { startDate, endDate, startTime, endTime, length = 20 }) => {
                if (startDate && endDate && startTime && endTime) {
                    const days = moment(endDate).diff(startDate, 'days') + 1;
                    const hours = moment(endTime).diff(startTime, 'hours');
                    const slots = (start: moment.Moment): Slot[] =>
                        Array.from({ length: (hours * 60) / length }, (_, i) => {
                            const starting = moment(start).add(i * length, 'm');
                            const ending = moment(starting).add(length, 'm');
                            return {
                                id: starting.toLocaleString(),
                                start: starting,
                                end: ending,
                            };
                        });
                    return Array(days)
                        .fill(0)
                        .map((_, i) => i)
                        .reduce(
                            (a, i) => {
                                const day = moment(startTime).add(i, 'd');
                                a[day.toLocaleString()] = slots(day);
                                return a;
                            },
                            {} as any,
                        );
                }
                return {};
            },
            {},
        );
        setSlots(dates);
    };
    const [selectedStds, setSelectedStds] = useState<
        {
            id: string;
            firstName: string;
            lastName: string;
        }[]
    >([]);

    const submitStudents = (): void => {
        const s = students
            .filter(({ selected }) => selected)
            .map(({ selected: _, ...rest }) => ({
                ...rest,
            }));
        setSelectedStds(s);
    };
    const submitForm = async (): Promise<void> => {
        const data = {
            students: selectedStds,
            dates: selectedStds,
            ...inputs,
        };
        const a = await apiClient('/appointments', {
            body: data,
        });
        console.log(a);
    };

    if (isNaN(step) || (step < 0 || step > 5)) {
        navigate('./1');
    }

    return (
        <>
            {
                {
                    1: <EventDetailStep {...inputs} onInputChange={handleInputChange} />,
                    2: (
                        <>
                            {students.map(student => (
                                <div key={student.id}>
                                    <label htmlFor={`student-${id}`}>
                                        {student.firstName} {student.lastName}
                                    </label>
                                    <input
                                        type="checkbox"
                                        name={student.id}
                                        id={`student-${id}`}
                                        onChange={handleStudentSelection}
                                        checked={student.selected || false}
                                    />
                                </div>
                            ))}
                            <Link onClick={submitStudents} to="../3">
                                Next
                            </Link>
                        </>
                    ),
                    3: (
                        <>
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
                            {dateRanges[dateRanges.length - 1].endDate && (
                                <button onClick={addDateRange}>Add Date</button>
                            )}
                            <Link onClick={submitDates} to="../3">
                                Next
                            </Link>
                        </>
                    ),
                    4: (
                        <>
                            Review Your Plan
                            {slots &&
                                Object.keys(slots).map(slotId => (
                                    <div key={slotId}>
                                        {slotId}
                                        {Object.values(slots[slotId]).map(({ start, id, end }) => {
                                            if (start && id && end) {
                                                return (
                                                    <div key={id}>
                                                        {start.format('h:mm a')} - {end.format('h:mm a')}
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                ))}
                            <Link to="/events" onClick={submitForm}>
                                Submit
                            </Link>
                        </>
                    ),
                }[step]
            }
        </>
    );
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

export const EventDetailStep: React.FC<{
    title: string;
    description: string;
    onInputChange: (name: 'title' | 'description', value: string) => void;
}> = ({ title, description, onInputChange }) => {
    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement | HTMLTextAreaElement }): void => {
        onInputChange(currentTarget.name as 'title' | 'description', currentTarget.value);
    };
    return (
        <fieldset>
            <legend className="ph0 mh0 fw6">Fill Event Details</legend>
            <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="title">
                    Title
                </label>
                <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    type="title"
                    name="title"
                    id="title"
                    value={title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="description">
                    Description
                </label>
                <textarea
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mt3">
                <Link to="../2">Next</Link>
            </div>
        </fieldset>
    );
};

export default Page;
