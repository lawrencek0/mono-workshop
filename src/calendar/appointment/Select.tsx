import React, { useMemo } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { useResource, useFetcher, useInvalidator } from 'rest-hooks';
import moment from 'moment';
import * as Yup from 'yup';
import { useAuthState } from 'auth/hooks';
import { InputWrapper, StyledSubmitBtn, FormWrapper } from 'shared/inputs/styles';
import { ErrorMessage } from 'shared/inputs/ErrorMessage';
import { AppointmentResource, SlotResource } from 'resources/AppointmentResource';
import { groupSlotsByDay } from 'calendar/helpers';
import { SlotsByDate } from 'calendar/types';
import { Field as FieldWithLabel } from 'shared/inputs/Field';
import { Title } from 'shared/cards/styles';
import { Avatar } from './create/StudentSelection';
import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { PrimaryButton } from 'shared/buttons';

// @TODO: allow detail to be updated, add student (after groups!)

type Props = RouteComponentProps & {
    detailId?: string;
};

const slotSelectionSchema = Yup.object({
    slot: Yup.string().required('Please select a slot'),
}).required();

const StudentSelect: React.FC<{
    slotDays: string[];
    slotsByDay: SlotsByDate;
    appointment: InstanceType<typeof AppointmentResource>;
}> = ({ slotDays, slotsByDay, appointment: { title, description } }) => {
    const { handleChange, values, isValid, isSubmitting, dirty } = useFormikContext<
        Yup.InferType<typeof slotSelectionSchema> & { selectedDay: string }
    >();
    const isDisabled = !isValid || isSubmitting;

    return (
        <>
            <h1>{title}</h1>
            <h2>{description}</h2>

            <ErrorMessage name="slot" />
            <Field as="select" name="selectedDay">
                {slotDays.map(slotDay => (
                    <option key={slotDay} value={slotDay}>
                        {slotDay}
                    </option>
                ))}
            </Field>
            {slotsByDay[values.selectedDay].map(slot => {
                let checked = parseInt(values.slot) === slot.id;
                if (!dirty && slot.student instanceof Object) {
                    checked = true;
                }
                return (
                    <InputWrapper key={slot.id}>
                        <input
                            type="radio"
                            name="slot"
                            css={tw`align-middle`}
                            value={slot.id}
                            id={slot.id.toString()}
                            checked={checked}
                            disabled={slot.student === true}
                            onChange={handleChange}
                        />
                        <StyledLabel htmlFor={slot.id.toString()}>
                            {moment(slot.start).format('hh:mm A')} - {moment(slot.end).format('hh:mm A')}
                            {slot.student instanceof Object && <span css={tw`ml-2 font-light`}>(selected)</span>}
                        </StyledLabel>
                    </InputWrapper>
                );
            })}
            <InputWrapper>
                <StyledSubmitBtn
                    type="submit"
                    value="Submit"
                    disabled={isDisabled}
                    variant={isDisabled ? 'disabled' : 'default'}
                />
            </InputWrapper>
        </>
    );
};

const Faculty: React.FC<{
    slotDays: string[];
    slotsByDay: SlotsByDate;
    handleSlotDelete: (slotId: number) => void;
    appointment: AppointmentResource;
}> = ({ slotDays, slotsByDay, appointment: { id, students }, handleSlotDelete }) => {
    const { values, isValid, isSubmitting } = useFormikContext<
        Yup.InferType<typeof slotSelectionSchema> & { selectedDay: string }
    >();
    const deleteAppointment = useFetcher(AppointmentResource.deleteShape());

    const handleDetailDelete = async (): Promise<void> => {
        await navigate('/calendar');
        await deleteAppointment({ id }, undefined);
    };

    const isDisabled = !isValid || isSubmitting;

    return (
        <>
            <FormWrapper>
                <Title css={tw`text-2xl`}>Appointment Detail</Title>
                <FieldWithLabel type="text" name="title" id="title" label="Title" />
                <FieldWithLabel as="textarea" type="text" name="description" id="description" label="Description" />
                <StyledSubmitBtn
                    css={tw`w-1/4`}
                    type="submit"
                    value="Save"
                    disabled={isDisabled}
                    variant={isDisabled ? 'disabled' : 'default'}
                />
            </FormWrapper>
            <FormWrapper>
                <Title css={tw`text-2xl`}>Time Slots</Title>
                <Field as="select" name="selectedDay" css={tw`mb-4`}>
                    {slotDays.map(slotDay => (
                        <option key={slotDay} value={slotDay}>
                            {slotDay}
                        </option>
                    ))}
                </Field>
                {slotsByDay[values.selectedDay].map(slot => {
                    return (
                        <div css={tw`flex items-center my-2 w-full `} key={slot.id}>
                            {moment(slot.start).format('hh:mm A')} - {moment(slot.end).format('hh:mm A')}
                            {slot.student && slot.student instanceof Object && (
                                <div css={tw`flex items-center ml-8 mr-auto`}>
                                    {slot.student.picUrl ? (
                                        <Avatar css={tw`w-12 h-12 mr-2`} src={slot.student.picUrl} />
                                    ) : (
                                        <FaUserCircle size="3em" />
                                    )}
                                    <div>
                                        {slot.student.firstName} {slot.student.lastName}
                                    </div>
                                </div>
                            )}
                            <div
                                css={tw`ml-auto cursor-pointer text-gray-500`}
                                onClick={() => handleSlotDelete(slot.id)}
                            >
                                <FaTrash size="1em" aria-label="Delete Slot" />
                            </div>
                        </div>
                    );
                })}
            </FormWrapper>
            {students && (
                <FormWrapper>
                    <Title css={tw`text-2xl`}>Students</Title>
                    <div css={tw`flex flex-wrap justify-between`}>
                        {students.map(student => (
                            <div key={student.id} css={tw`flex items-center ml-8 mr-auto`}>
                                {student.picUrl ? (
                                    <Avatar css={tw`w-12 h-12 mr-2`} src={student.picUrl} />
                                ) : (
                                    <FaUserCircle size="3em" />
                                )}
                                <div>
                                    {student.firstName} {student.lastName}
                                </div>
                            </div>
                        ))}
                    </div>
                </FormWrapper>
            )}
            <FormWrapper css={tw`bg-transparent shadow-none p-0`}>
                <PrimaryButton type="button" css={tw`w-1/4`} onClick={handleDetailDelete} variant="danger">
                    Delete?
                </PrimaryButton>
            </FormWrapper>
        </>
    );
};

const Select: React.FC<Props> = ({ detailId }) => {
    const {
        user: { role },
    } = useAuthState();

    const appointment = useResource(AppointmentResource.detailShape(), { id: detailId });

    // used to refetch the slots after the PUT request
    const invalidator = useInvalidator(AppointmentResource.detailShape());
    const update = useFetcher(SlotResource.partialUpdateShape());
    const deleteSlot = useFetcher(SlotResource.deleteShape());

    const handleSlotDelete = async (slotId: number): Promise<void> => {
        if (appointment.slots && appointment.students && appointment.slots.length - 1 > appointment.students.length) {
            await deleteSlot({ id: slotId, detailId }, undefined);
        } else {
            alert('There will be less slots than students');
        }
    };

    // if the user has already selected the slot then only that slot will have an object
    // containing the student's info
    const slotsByDay = useMemo(() => {
        if (appointment.slots) {
            return groupSlotsByDay(appointment.slots);
        }
        return undefined;
    }, [appointment]);

    if (!detailId) {
        navigate('/calendar');
        return <>Navigating to calendar...</>;
    }

    if (!appointment.slots || !slotsByDay) {
        return <>Loading Appointment Slots...</>;
    }

    const selectedSlot =
        role === 'student' ? appointment.slots.find(slot => slot.student instanceof Object) : undefined;
    const slotDays = Object.keys(slotsByDay);

    return (
        <Formik
            initialValues={{
                title: appointment.title,
                description: appointment.description,
                slot: selectedSlot ? selectedSlot.id.toString() : '',
                selectedDay: selectedSlot ? moment(selectedSlot.start).format('YYYY/MM/DD') : slotDays[0],
            }}
            validationSchema={slotSelectionSchema}
            onSubmit={async ({ slot: slotId }) => {
                try {
                    console.log('is this called');
                    await update({ id: slotId, detailId }, {});
                    // invalidates the cache and causes a refetch
                    await invalidator({ id: detailId });
                } catch (e) {
                    // @TODO: better error handling
                    console.error(e);
                }
            }}
        >
            <Form>
                {role === 'faculty' ? (
                    <Faculty
                        slotDays={slotDays}
                        slotsByDay={slotsByDay}
                        appointment={appointment}
                        handleSlotDelete={handleSlotDelete}
                    />
                ) : (
                    <StudentSelect slotDays={slotDays} slotsByDay={slotsByDay} appointment={appointment} />
                )}
            </Form>
        </Formik>
    );
};

const StyledLabel = styled.label`
    ${tw`mx-2`}
`;

export default Select;
