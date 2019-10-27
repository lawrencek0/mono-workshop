import React, { useState, useEffect } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { media, useMediaQueryString } from 'theme';
import { Stepper } from './Stepper';
import { Details } from './Details';
import { StudentSelection } from './StudentSelection';
import { RangePicker } from './RangePicker';
import { AppointmentSlotsReview } from './SlotsReview';
import { getAllStudents } from 'utils/students-client';
import { Slot, SlotsByDate, DateTimeRange, Student } from 'calendar/types';
import { slotsFromRanges, slotsByDay } from 'calendar/helpers';
import { createAppointment } from 'calendar/client';
import { Wrapper as FormWrapper } from 'shared/cards/styles';

type Props = RouteComponentProps<{ step: string }>;

const PageTitles = [
    'Fill Appointment Details',
    'Select Students',
    'Select the Date Range',
    'Review the Details',
] as const;

// @FIXME: this is probably not the best way to distribute state
// @TODO: Add a back button, ability to go to any valid step
const Page: React.FC<Props> = ({ step: stepStr = '0' }) => {
    const isDesktop = useMediaQueryString('desktop');
    // @TODO: range in TS https://github.com/Microsoft/TypeScript/issues/15480
    const step = Number(stepStr.charAt(0)) as 1 | 2 | 3 | 4;

    const goToPage = (page: number): void => {
        navigate(`./${page}`);
    };

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
        return <>Loading form</>;
    }

    return (
        <>
            <Wrapper>
                <Stepper
                    title="Create New Appointment"
                    steps={PageTitles}
                    direction={isDesktop ? 'horizontal' : 'vertical'}
                    activeStep={step as number}
                    goToPage={goToPage}
                />
                <FormWrapper>
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
                </FormWrapper>
            </Wrapper>
        </>
    );
};
const Wrapper = styled.div`
    ${tw`flex flex-col-reverse lg:flex-col w-full lg:w-2/3 m-auto`}
`;

export default Page;
