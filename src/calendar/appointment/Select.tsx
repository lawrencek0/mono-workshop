import React, { useMemo, useEffect } from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { RouteComponentProps, navigate } from '@reach/router';
import { Formik, Form, FormikProps, Field } from 'formik';
import { useResource, useFetcher, useInvalidator } from 'rest-hooks';
import moment from 'moment';
import * as Yup from 'yup';
import { useAuthState } from 'auth/hooks';
import { InputWrapper, StyledSubmitBtn } from 'shared/inputs/styles';
import { ErrorMessage } from 'shared/inputs/ErrorMessage';
import { Wrapper } from 'shared/cards/styles';
import { AppointmentResource, SlotResource } from 'resources/AppointmentResource';
import { groupSlotsByDay } from 'calendar/helpers';

type Props = RouteComponentProps & {
    detailId?: string;
};

const slotSelectionSchema = Yup.object({
    slot: Yup.string().required('Please select a slot'),
}).required();

const renderForFaculty = (slots: InstanceType<typeof SlotResource>[]): React.ReactNode => {
    return slots.map(slot => {
        return (
            <div key={slot.id}>
                {moment(slot.start).format('hh:mm A')} - {moment(slot.end).format('hh:MM A')}
            </div>
        );
    });
};

const StudentSelect: React.FC<{ detailId: string; slots: InstanceType<typeof SlotResource>[] }> = ({
    detailId,
    slots,
}) => {
    // used to refetch the slots after the PUT request
    const invalidator = useInvalidator(AppointmentResource.detailShape());
    const update = useFetcher(SlotResource.partialUpdateShape());
    // if the user has already selected the slot then only that slot will have an object
    // containing the student's info
    const selectedSlot = slots.find(slot => slot.student instanceof Object);
    const slotsByDay = useMemo(() => groupSlotsByDay(slots), [slots]);
    const slotDays = Object.keys(slotsByDay);

    useEffect(() => {
        return () => {
            invalidator({ id: detailId });
        };
    }, [detailId, invalidator]);

    return (
        <Formik
            initialValues={{
                slot: selectedSlot ? selectedSlot.id.toString() : '',
                selectedDay: selectedSlot ? moment(selectedSlot.start).format('YYYY/MM/DD') : slotDays[0],
            }}
            validationSchema={slotSelectionSchema}
            onSubmit={async ({ slot: slotId }) => {
                try {
                    await update({ id: slotId, detailId }, {});
                    // invalidates the cache and causes a refetch
                    await invalidator({ id: detailId });
                } catch (e) {
                    // @TODO: better error handling
                    console.error(e);
                }
            }}
        >
            {({
                handleChange,
                values,
                isValid,
                isSubmitting,
                dirty,
            }: FormikProps<Yup.InferType<typeof slotSelectionSchema> & { selectedDay: string }>) => {
                const isDisabled = !isValid || isSubmitting;
                return (
                    <Form>
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
                                        {slot.student instanceof Object && (
                                            <span css={tw`ml-2 font-light`}>(selected)</span>
                                        )}
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
                    </Form>
                );
            }}
        </Formik>
    );
};

const Select: React.FC<Props> = ({ detailId }) => {
    const {
        user: { role },
    } = useAuthState();

    const { title, slots } = useResource(AppointmentResource.detailShape(), { id: detailId });

    if (!detailId) {
        navigate('/calendar');
        return <>Navigating to calendar...</>;
    }
    if (!slots) {
        return <>Loading Appointment Slots...</>;
    }

    return (
        <Wrapper>
            <h1>Appointment: {title}</h1>
            {role === 'faculty' ? renderForFaculty(slots) : <StudentSelect detailId={detailId} slots={slots} />}
        </Wrapper>
    );
};

const StyledLabel = styled.label`
    ${tw`mx-2`}
`;

export default Select;
