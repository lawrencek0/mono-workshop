import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import moment from 'moment';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useMediaQueryString } from 'theme';
import { getAllStudents } from 'utils/students-client';
import { Slot, SlotsByDate, DateTimeRange, Student } from 'calendar/types';
import { slotsFromRanges, slotsByDay } from 'calendar/helpers';
import { FormWrapper } from 'shared/inputs/styles';
import { FlatButton, PrimaryButton } from 'shared/buttons';
import { Stepper } from './Stepper';
import { Details } from './Details';
import { StudentSelection } from './StudentSelection';
import { RangePicker } from './RangePicker';
import { AppointmentSlotsReview } from './SlotsReview';

type Props = RouteComponentProps<{ step: string }>;

const PageTitles = [
    'Fill Appointment Details',
    'Select Students',
    'Select the Date Range',
    'Review the Details',
] as const;

const detailSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
}).required();

const studentsSchema = Yup.object({
    students: Yup.array(Yup.string().required()).min(1, 'At least one student should be selected'),
}).required();

const datetimeRangesSchema = Yup.object({
    datetimeRanges: Yup.array(
        Yup.object({
            id: Yup.number().required(),
            startDate: Yup.string()
                .nullable()
                .required()
                .test('is-lesser', "Start date can't be after end date", function(value) {
                    const { endDate } = this.parent;
                    return moment(value).isBefore(moment(endDate));
                }),
            endDate: Yup.string()
                .nullable()
                .required()
                .test('is-greater', "End date can't be before start date", function(value) {
                    const { startDate } = this.parent;
                    return moment(value).isAfter(moment(startDate));
                }),
            times: Yup.array(
                Yup.object({
                    id: Yup.number().required(),
                    startTime: Yup.string()
                        .required()
                        .test('is-valid', 'Invalid time', function(value) {
                            return moment(value, 'HH:mm').isValid();
                        })
                        .test('is-lesser', "Start time can't be after end time", function(value) {
                            const { endTime } = this.parent;
                            return moment(value, 'HH:mm').isBefore(moment(endTime, 'HH:mm'));
                        }),
                    endTime: Yup.string()
                        .required()
                        .test('is-valid', 'Invalid time', function(value) {
                            return moment(value, 'HH:mm').isValid();
                        })
                        .test('is-greater', "End time can't be before start time", function(value) {
                            const { startTime } = this.parent;
                            return moment(value, 'HH:mm').isAfter(moment(startTime, 'HH:mm'));
                        }),
                }),
            )
                .required()
                .min(1, 'At least one Time Range'),
        }),
    )
        .required()
        .min(1, 'At least one Datetime range should be selected'),
});

const final = Yup.object();

const schemas = [detailSchema, studentsSchema, datetimeRangesSchema, final];

export type DatetimeRange = Yup.InferType<typeof datetimeRangesSchema>;
type Schema = Yup.InferType<typeof schemas[number]>;

// @FIXME: this is probably not the best way to distribute state
// @TODO: Add a back button, ability to go to any valid step
const Page: React.FC<Props> = ({ step: stepStr = '0' }) => {
    const isDesktop = useMediaQueryString('desktop');
    const daterangeId = useRef(0);
    const timerangeId = useRef(0);
    // @TODO: range in TS https://github.com/Microsoft/TypeScript/issues/15480
    const step = Number(stepStr.charAt(0)) as 1 | 2 | 3 | 4;

    const goToPage = (page: number): void => {
        navigate(`./${page}`);
    };

    const [students, setStudents] = useState<Student[]>([
        { id: 'adfad', firstName: 'Hon', lastName: 'Noh', role: 'student', bio: 'hmm' },
        { id: 'adsfad', firstName: 'Hon', lastName: 'Noh', role: 'student', bio: 'hmm' },
        { id: 'adssfad', firstName: 'Hon', lastName: 'Noh', role: 'student', bio: 'hmm' },
    ]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const students = await getAllStudents();
            setStudents(students);
        };
        fetchData();
    }, []);

    const handleDatesSubmit = (dateRanges: DateTimeRange[]): void => {
        const slots = slotsFromRanges(dateRanges);
        const dates = slotsByDay(slots);
        setSlots(slots.flat());
        setSlotsByDate(dates);
    };

    const isLastStep = (): boolean => {
        if (step === 4) {
            return true;
        }
        return false;
    };

    const handleNext = (): void => {
        navigate(`./${step + 1}`);
    };

    const handlePrevious = (): void => {
        navigate(`./${step - 1}`);
    };

    // @TODO: work on this after fixing up review
    const handleFormSubmit = async (): Promise<void> => {
        // const data = {
        //     students: selectedStudents,
        //     dates: slots,
        //     ...inputs,
        // };
        // await createAppointment(data);
        if (isLastStep()) {
            await navigate('/calendar');
            return;
        }

        handleNext();
    };

    const renderNavBtns = (formikBag: FormikProps<Schema>, back: boolean): React.ReactElement => {
        const isDisabled = !formikBag.isValid || formikBag.isSubmitting;

        return (
            <div>
                {back && (
                    <FlatButton type="button" css={tw`mr-4`} onClick={handlePrevious}>
                        Previous
                    </FlatButton>
                )}
                <PrimaryButton type="submit" disabled={isDisabled} variant={isDisabled ? 'disabled' : 'default'}>
                    {isLastStep() ? 'Submit' : 'Next'}
                </PrimaryButton>
            </div>
        );
    };

    if (isNaN(step) || (step < 1 || step > 4)) {
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
                <Formik
                    initialValues={
                        {
                            title: '',
                            description: '',
                            students: [],
                            datetimeRanges: [
                                {
                                    id: daterangeId.current,
                                    times: [
                                        {
                                            id: timerangeId.current,
                                            startTime: moment()
                                                .hours(9)
                                                .minute(0)
                                                .second(0)
                                                .millisecond(0)
                                                .format('HH:mm'),
                                            endTime: moment()
                                                .hours(14)
                                                .minute(0)
                                                .second(0)
                                                .millisecond(0)
                                                .format('HH:mm'),
                                        },
                                    ],
                                    startDate: null,
                                    endDate: null,
                                    length: 20,
                                },
                            ],
                        } as Schema
                    }
                    validationSchema={schemas[step - 1]}
                    onSubmit={handleFormSubmit}
                >
                    {formikProps => (
                        <FormWrapper css={tw`w-11/12 md:w-full xl:w-8/12 lg:mt-8`}>
                            <form onSubmit={formikProps.handleSubmit}>
                                {
                                    {
                                        1: <Details />,
                                        2: <StudentSelection students={students} />,
                                        3: <RangePicker daterangeRef={daterangeId} timerangeRef={timerangeId} />,
                                        4: (
                                            <AppointmentSlotsReview
                                                slots={slotsByDate}
                                                handleSubmit={handleFormSubmit}
                                            />
                                        ),
                                    }[step]
                                }
                                {renderNavBtns(formikProps, step > 1)}
                            </form>
                        </FormWrapper>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    ${tw`flex items-center flex-col-reverse lg:flex-col w-full lg:w-2/3 m-auto`}
`;

export default Page;
