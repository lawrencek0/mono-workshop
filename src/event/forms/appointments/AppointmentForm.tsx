import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components';
import moment from 'moment';
import { apiClient } from 'utils/api-client';
import { media } from 'theme';
import { Stepper } from './Stepper';
import { AppointmentDetailsForm } from './AppointmentDetails';
import { Student, StudentSelection } from './StudentSelection';
import { DateTimeRange, RangePicker } from './RangePicker';
import { AppointmentSlotsReview, SlotsByDate } from './AppointmentSlotsReview';
import { slotsFromRanges, slotsByDay } from './helpers';

type Props = RouteComponentProps & {
    step?: 1 | 2 | 3 | 4;
};

const Page: React.FC<Props> = ({ step = 1 }) => {
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
    });
    const [students, setStudents] = useState<Student[]>([
        {
            id: 'dfdas',
            firstName: 'dfasd',
            lastName: 'dfasda',
        },
        { id: 'afaf', firstName: 'dfasd', lastName: 'dfasda' },
    ]);
    const [selectedStudents, setSelectedStudents] = useState<
        {
            id: string;
        }[]
    >([]);
    const [slots, setSlots] = useState<SlotsByDate>({});

    if (isNaN(step) || (step < 0 || step > 5)) {
        navigate('./1');
    }

    const handleStudentSelection = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setStudents(
            students.map(student => {
                if (student.id === currentTarget.name) {
                    const selected = student.selected === undefined ? true : student.selected ? false : true;

                    return {
                        ...student,
                        selected,
                    };
                }
                return student;
            }),
        );
    };

    const handleInputChange = (name: 'title' | 'description', value: string): void => {
        setInputs(inputs => ({ ...inputs, [name]: value }));
    };

    const handleDatesSubmit = (dateRanges: DateTimeRange[]): void => {
        const dates = slotsByDay(slotsFromRanges(dateRanges));
        // @TODO: remove only for demoing to the backend team!
        console.log(dates);
        setSlots(dates);
    };

    const handleStudentsSubmit = (): void => {
        setSelectedStudents(students.filter(({ selected }) => selected).map(({ id }) => ({ id })));
    };

    const handleFormSubmit = async (): Promise<void> => {
        const data = {
            students: selectedStudents,
            dates: slots,
            ...inputs,
        };
        const a = await apiClient('/appointments', {
            body: data,
        });
        console.log(a);
    };

    return (
        <>
            <div className="f3">Create New Appointment</div>
            <Wrapper>
                <Stepper
                    steps={[
                        'Fill Appointment Details',
                        'Select Students',
                        'Select the Date Range',
                        'Review the Details',
                    ]}
                    activeStep={step as number}
                />
                {
                    {
                        1: <AppointmentDetailsForm {...inputs} onInputChange={handleInputChange} />,
                        2: (
                            <StudentSelection
                                students={students}
                                onStudentSelection={handleStudentSelection}
                                onSubmit={handleStudentsSubmit}
                            />
                        ),
                        3: <RangePicker onSubmit={handleDatesSubmit} />,
                        4: <AppointmentSlotsReview slots={slots} onSubmit={handleFormSubmit} />,
                    }[step]
                }
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div.attrs(() => ({
    className: 'center w-90',
}))`
    ${media.desktop} {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 3rem;
    }
`;

export default Page;
