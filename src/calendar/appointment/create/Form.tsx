import React, { useState, useEffect } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components';
import { media } from 'theme';
import { Stepper } from './Stepper';
import { Details } from './Details';
import { StudentSelection } from './StudentSelection';
import { RangePicker } from './RangePicker';
import { AppointmentSlotsReview } from './SlotsReview';
import { getAllStudents } from 'utils/students-client';
import { Slot, SlotsByDate, DateTimeRange, Student } from 'calendar/types';
import { slotsFromRanges, slotsByDay } from 'calendar/helpers';
import { createAppointment } from 'calendar/client';

type Props = RouteComponentProps & {
    step?: 1 | 2 | 3 | 4;
};

// @FIXME: this is probably not the best way to distribute state
// @TODO: Add a back button, ability to go to any valid step
const Page: React.FC<Props> = ({ step = 1 }) => {
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
    });
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<
        {
            id: string;
        }[]
    >([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const students = await getAllStudents();
            setStudents(students);
        };
        fetchData();
    }, []);

    const handleStudentSelection = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => {
        setStudents(
            students.map(student => {
                // @FIXME: need to hashid on the backend
                if (student.id == currentTarget.name) {
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
        const slots = slotsFromRanges(dateRanges);
        const dates = slotsByDay(slots);
        setSlots(slots.flat());
        setSlotsByDate(dates);
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
        await createAppointment(data);
        await navigate('/calendar');
    };

    if (isNaN(step) || (step < 0 || step > 5)) {
        navigate('./1');
    }

    return (
        <>
            <Wrapper>
                <Stepper
                    title="Create New Appointment"
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
                        1: <Details {...inputs} onInputChange={handleInputChange} />,
                        2: (
                            <StudentSelection
                                students={students}
                                onStudentSelection={handleStudentSelection}
                                onSubmit={handleStudentsSubmit}
                            />
                        ),
                        3: <RangePicker onSubmit={handleDatesSubmit} />,
                        4: <AppointmentSlotsReview slots={slotsByDate} handleSubmit={handleFormSubmit} />,
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
