import React, { useState } from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { useFormikContext } from 'formik';
import { MdAdd } from 'react-icons/md';
import { MdRemove } from 'react-icons/md';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { FormTitle, InputWrapper, StyledLabel, ButtonWrapper } from 'shared/inputs/styles';
import { Field } from 'shared/inputs/Field';
import { FlatButton, PrimaryButton } from 'shared/buttons';
import { DatetimeRange } from './Form';

type PickerProps = DatetimeRange['datetimeRanges'][number] & {
    canDelete: boolean;
    datetimeIndex: number;
    removeDateRange: (id: number) => void;
    handleAddTimeRange: () => void;
    handleRemoveTimeRange: (timerangeId: number) => void;
};

type RangePickerProps = {
    daterangeRef: React.MutableRefObject<number>;
    timerangeRef: React.MutableRefObject<number>;
};

const blockedDays = (day: moment.Moment): boolean => {
    const num = moment(day).weekday();

    // block weekends
    if (num === 0 || num === 6) {
        return true;
    }

    return false;
};

const Picker: React.FC<PickerProps> = ({
    handleAddTimeRange,
    handleRemoveTimeRange,
    removeDateRange,
    id: datetimeId,
    startDate,
    endDate,
    canDelete,
    datetimeIndex,
    times,
}) => {
    const { setFieldValue } = useFormikContext<DatetimeRange>();

    const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

    const handleFocusChange = (focus: 'startDate' | 'endDate' | null): void => {
        setFocusedInput(focus);
    };

    const handleRemoveClick = (): void => {
        removeDateRange(datetimeId);
    };

    const handleDatesChange = ({
        startDate,
        endDate,
    }: {
        startDate: moment.Moment | null;
        endDate: moment.Moment | null;
    }): void => {
        const start = startDate
            ? moment(startDate)
                  .startOf('day')
                  .toISOString()
            : null;
        const end = endDate
            ? moment(endDate)
                  .endOf('day')
                  .toISOString()
            : null;

        setFieldValue(`datetimeRanges[${datetimeIndex}].startDate` as 'datetimeRanges', start);
        setFieldValue(`datetimeRanges[${datetimeIndex}].endDate` as 'datetimeRanges', end);
    };

    return (
        <>
            <DateRangePickerWrapper>
                <StyledLabel css={tw`block text-gray-700`}>Pick Dates</StyledLabel>
                <DateRangePicker
                    onDatesChange={handleDatesChange}
                    startDate={startDate ? moment(startDate) : null}
                    startDateId={`startDateId-${datetimeId}`}
                    endDate={endDate ? moment(endDate) : null}
                    endDateId={`endDateId-${datetimeId}`}
                    onFocusChange={handleFocusChange}
                    focusedInput={focusedInput}
                    minimumNights={0}
                    isDayBlocked={blockedDays}
                />
            </DateRangePickerWrapper>

            {times.map(({ id: timerangeId }, index) => {
                return (
                    <InputWrapper key={timerangeId} css={tw`flex mb-0`}>
                        <div css={tw`mr-4`}>
                            <StyledField
                                label="Start Time"
                                labelHidden={index > 0}
                                type="time"
                                name={`datetimeRanges[${datetimeIndex}].times[${index}].startTime`}
                                id={`start-${datetimeId}-${timerangeId}`}
                            />
                        </div>
                        <div css={tw`mr-4`}>
                            <StyledField
                                label="End Time"
                                labelHidden={index > 0}
                                type="time"
                                name={`datetimeRanges[${datetimeIndex}].times[${index}].endTime`}
                                id={`end-${datetimeId}-${timerangeId}`}
                            />
                        </div>
                        <div css={tw`self-center`}>
                            {times.length > 1 && (
                                <button type="button" onClick={() => handleRemoveTimeRange(timerangeId)}>
                                    <MdRemove />
                                </button>
                            )}
                            {index === times.length - 1 && (
                                <button type="button" onClick={handleAddTimeRange}>
                                    <MdAdd />
                                </button>
                            )}
                        </div>
                    </InputWrapper>
                );
            })}
            <InputWrapper>
                <StyledField
                    label="Length (in minutes)"
                    type="number"
                    min="1"
                    name={`datetimeRanges[${datetimeIndex}].length`}
                    id={`length-${datetimeId}`}
                />
            </InputWrapper>
            {canDelete && (
                <InputWrapper>
                    <PrimaryButton variant="danger" type="button" onClick={handleRemoveClick}>
                        Delete?
                    </PrimaryButton>
                </InputWrapper>
            )}
        </>
    );
};

const StyledField = styled(Field)`
    ${tw`w-40 flex flex-col`}
`;

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

const RangePicker: React.FC<RangePickerProps> = ({ daterangeRef, timerangeRef }) => {
    const {
        values: { datetimeRanges },
        setFieldValue,
    } = useFormikContext<DatetimeRange>();

    const addDateRange = (): void => {
        daterangeRef.current++;
        const prevEndDate = datetimeRanges[datetimeRanges.length - 1].endDate;
        setFieldValue('datetimeRanges', [
            ...datetimeRanges,
            {
                ...datetimeRanges[datetimeRanges.length - 1],
                id: daterangeRef.current,
                startDate: prevEndDate ? moment(prevEndDate).add(1, 'day') : null,
                endDate: null,
            },
        ]);
    };

    const removeDateRange = (datetimeId: number): void => {
        setFieldValue('datetimeRanges', datetimeRanges.filter(({ id }) => id !== datetimeId));
    };

    const addTimeRange = (datetimeId: number) => (): void => {
        timerangeRef.current++;
        const datetimeIndex = datetimeRanges.findIndex(({ id }) => id === datetimeId);
        const timeArr = datetimeRanges[datetimeIndex].times;
        setFieldValue('datetimeRanges', [
            ...datetimeRanges.slice(0, datetimeIndex),
            {
                ...datetimeRanges[datetimeIndex],
                times: [
                    ...timeArr,
                    {
                        id: timerangeRef.current,
                        startTime: timeArr[timeArr.length - 1].endTime,
                        endTime: '',
                    },
                ],
            },
            ...datetimeRanges.slice(datetimeIndex + 1),
        ]);
    };

    const removeTimeRange = (datetimeId: number) => (timerangeId: number): void => {
        const datetimeIndex = datetimeRanges.findIndex(({ id }) => id === datetimeId);
        const times = datetimeRanges[datetimeIndex].times.filter(({ id }) => id !== timerangeId);

        setFieldValue('datetimeRanges', [
            ...datetimeRanges.slice(0, datetimeIndex),
            {
                ...datetimeRanges[datetimeIndex],
                times,
            },
            ...datetimeRanges.slice(datetimeIndex + 1),
        ]);
    };

    const canAddRange = datetimeRanges && !datetimeRanges[datetimeRanges.length - 1].endDate;

    return (
        <>
            <FormTitle>Select the Date and Time Range</FormTitle>
            {datetimeRanges.map((datetime, i) => (
                <Picker
                    key={datetime.id}
                    handleAddTimeRange={addTimeRange(datetime.id)}
                    handleRemoveTimeRange={removeTimeRange(datetime.id)}
                    canDelete={datetimeRanges.length > 1}
                    removeDateRange={removeDateRange}
                    datetimeIndex={i}
                    {...datetime}
                />
            ))}
            <ButtonWrapper>
                <FlatButton
                    type="button"
                    disabled={canAddRange}
                    variant={canAddRange ? 'disabled' : 'default'}
                    onClick={addDateRange}
                >
                    Add Range
                </FlatButton>
            </ButtonWrapper>
        </>
    );
};

export { RangePicker };
