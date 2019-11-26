import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useFetcher } from 'rest-hooks';
import { GroupEventResource } from 'resources/GroupResource';
import { Formik, Form } from 'formik';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import * as Yup from 'yup';
import { Title } from 'shared/cards/styles';
import { Wrapper, ErrorMessage } from 'auth/Login';
import { StyledSubmitBtn, StyledLabel } from 'shared/inputs/styles';
import { Field as FieldWithLabel } from 'shared/inputs/Field';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import moment from 'moment';
import { Separator } from 'calendar/dashboard/Modal';
import { StyledColor } from 'calendar/appointment/create/Details';

const schema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
    location: Yup.string().notRequired(),
    color: Yup.string().required(),
    startDate: Yup.string()
        .nullable()
        .required()
        .test('is-lesser', "Start date can't be after end date", function(value) {
            const { endDate } = this.parent;
            return moment(value).isSameOrBefore(moment(endDate));
        }),
    endDate: Yup.string()
        .nullable()
        .required()
        .test('is-greater', "End date can't be before start date", function(value) {
            const { startDate } = this.parent;
            return moment(value).isSameOrAfter(moment(startDate));
        }),
    startTime: Yup.string()
        .required('Start time is required')
        .test('is-valid', 'Invalid time', function(value) {
            return moment(value, 'HH:mm').isValid();
        })
        .test('is-lesser', "Start time can't be after end time", function(value) {
            const { endTime } = this.parent;
            return moment(value, 'HH:mm').isBefore(moment(endTime, 'HH:mm'));
        }),
    endTime: Yup.string()
        .required('End time is required')
        .test('is-valid', 'Invalid time', function(value) {
            return moment(value, 'HH:mm').isValid();
        })
        .test('is-greater', "End time can't be before start time", function(value) {
            const { startTime } = this.parent;
            return moment(value, 'HH:mm').isAfter(moment(startTime, 'HH:mm'));
        }),
});

const Post: React.FC<RouteComponentProps & { groupId?: string }> = ({ groupId }) => {
    const create = useFetcher(GroupEventResource.createShape());

    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                location: '',
                color: '#FFF382',
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                startTime: moment().format('HH:mm'),
                endTime: moment()
                    .add(1, 'h')
                    .format('HH:mm'),
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                try {
                    await create(
                        { groupId },
                        {
                            ...values,
                            start: moment(values.startDate)
                                .add(moment(values.startTime, 'HH:mm').hours(), 'hours')
                                .add(moment(values.startTime, 'HH:mm').minutes(), 'minutes')
                                .toLocaleString(),
                            end: moment(values.endDate)
                                .add(moment(values.endTime, 'HH:mm').hours(), 'hours')
                                .add(moment(values.endTime, 'HH:mm').minutes(), 'minutes')
                                .toLocaleString(),
                        },
                        [
                            [
                                GroupEventResource.listShape(),
                                { groupId },
                                (postId: string, postIds: string[] | undefined) => [postId, ...(postIds || [])],
                            ],
                        ],
                    );
                    await navigate(`/groups/${groupId}`);
                } catch (e) {
                    actions.setSubmitting(false);
                    if (e && e.response && e.response.body) {
                        const msg = e.response.body ? e.response.body.message : e.response.text;
                        actions.setStatus(JSON.stringify(msg));
                    } else {
                        actions.setStatus(JSON.stringify(e));
                    }
                }
            }}
        >
            {props => {
                const isDisabled = !props.isValid || props.isSubmitting;

                return (
                    <Wrapper
                        css={groupId ? tw`lg:w-full xl:w-full` : tw`lg:w-2/3 xl:w-6/12`}
                        variant={props.status && !props.isSubmitting ? 'danger' : 'default'}
                    >
                        <ErrorMessage>{props.status}</ErrorMessage>
                        <Title css={tw`text-2xl text-center`}>Create a New Event</Title>
                        <Form autoComplete="off">
                            <FieldWithLabel type="text" name="title" id="title" label="Title" />
                            <Label>Description</Label>
                            <Editor
                                init={{
                                    height: 125,
                                    menubar: false,
                                    skin: false,
                                    // eslint-disable-next-line @typescript-eslint/camelcase
                                    content_css: false,
                                    // eslint-disable-next-line @typescript-eslint/camelcase
                                    content_style: `.mce-content-body {
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                                        "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", 
                                        "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                                    }`,
                                }}
                                plugins={['link', 'code']}
                                onChange={e => {
                                    props.setFieldValue('description', e.target.getContent());
                                }}
                            />
                            <Separator aria-hidden />
                            <div css={tw`flex items-center my-4`}>
                                <FieldWithLabel
                                    css={tw`mr-4`}
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    label="Start Date"
                                />
                                <FieldWithLabel type="date" name="endDate" id="enddDate" label="End Date" />
                            </div>
                            <div css={tw`flex items-center my-4`}>
                                <FieldWithLabel
                                    css={tw`mr-4`}
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    label="Start Time"
                                />
                                <FieldWithLabel type="time" name="endTime" id="endTime" label="End Time" />
                            </div>
                            <StyledColor
                                css={tw`flex items-center`}
                                type="color"
                                name="color"
                                id="color"
                                label="Color"
                            />
                            <StyledSubmitBtn
                                css={tw`mt-4`}
                                type="submit"
                                value="Create Event"
                                disabled={isDisabled}
                                variant={isDisabled ? 'disabled' : 'default'}
                            />
                        </Form>
                    </Wrapper>
                );
            }}
        </Formik>
    );
};

const Label = styled(StyledLabel)`
    ${tw`mt-4 block`}
`;

export default Post;
