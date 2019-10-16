import React, { useState, useRef } from 'react';
// these are needed to use the CSS Prop
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styled from 'styled-components/macro';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as types from 'styled-components/cssprop';
import tw from 'tailwind.macro';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateTimeRange } from 'calendar/types';
import {
    FormWrapper,
    FormTitle,
    InputWrapper,
    StyledInput,
    StyledLabel,
    StyledLink,
    ButtonWrapper,
} from 'shared/inputs';
import { FlatButton, PrimaryButton } from 'shared/buttons';

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
            <DateRangePickerWrapper>
                <StyledLabel
                    css={`
                        ${tw`block`}
                    `}
                >
                    Pick Dates
                </StyledLabel>
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
            </DateRangePickerWrapper>

            <InputWrapper
                css={`
                    ${tw`flex`}
                `}
            >
                <div
                    css={`
                        ${tw`mr-4`}
                    `}
                >
                    <StyledLabel htmlFor={`start-${id}`}>Start Time</StyledLabel>
                    <StyledInput
                        type="time"
                        name="startTime"
                        id={`start-${id}`}
                        value={startTime.format('HH:mm')}
                        onChange={handleInputTimeChanges}
                    />
                </div>
                <div>
                    <StyledLabel htmlFor={`end-${id}`}>End Time</StyledLabel>
                    <StyledInput
                        type="time"
                        name="endTime"
                        id={`end-${id}`}
                        value={endTime.format('HH:mm')}
                        onChange={handleInputTimeChanges}
                    />
                </div>
            </InputWrapper>
            <InputWrapper>
                <StyledLabel htmlFor={`length-${id}`}>Length (in minutes)</StyledLabel>
                <StyledInput
                    css={`
                        ${tw`w-full md:w-1/4 block`}
                    `}
                    type="number"
                    min="0"
                    max="59"
                    name="length"
                    id={`length-${id}`}
                    value={length}
                    onChange={handleInputTimeChanges}
                />
            </InputWrapper>
            {canDelete && (
                <InputWrapper>
                    <PrimaryButton variant="danger" onClick={handleRemoveClick}>
                        Delete?
                    </PrimaryButton>
                </InputWrapper>
            )}
        </>
    );
};

const DateRangePickerWrapper = styled(InputWrapper)`
    .DateInput_input {
        ${tw`font-normal text-gray-800`}
    }
    .DateInput_input__focused {
        ${tw`border-primary-600`}
    }

    .CalendarDay__selected {
        ${tw`bg-primary-600 border-primary-300
            hover:bg-primary-600 hover:border-primary-300
            active:bg-primary-600 active:border-primary-300`}
    }

    .CalendarDay__selected_span:not(.CalendarDay__blocked_calendar),
    .CalendarDay__hovered_span:not(.CalendarDay__blocked_calendar) {
        ${tw`bg-primary-400 border-primary-200 text-white
            hover:bg-primary-500 hover:border-primary-200 text-white
            active:bg-primary-500 active:border-primary-200 text-white`}
    }
`;

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

    const canAddRange = !dateRanges[dateRanges.length - 1].endDate;

    return (
        <FormWrapper>
            <FormTitle>Select the Date and Time Range</FormTitle>
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
            <ButtonWrapper>
                <FlatButton
                    css={`
                        ${tw`mr-4`}
                    `}
                    disabled={canAddRange}
                    variant={canAddRange ? 'disabled' : 'default'}
                    onClick={addDateRange}
                >
                    Add Range
                </FlatButton>
                <StyledLink onClick={handleSubmit} to="../4">
                    Next
                </StyledLink>
            </ButtonWrapper>
        </FormWrapper>
    );
};

export { RangePicker };
