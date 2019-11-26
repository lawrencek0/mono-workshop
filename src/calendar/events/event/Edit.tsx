import React, { useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useFetcher, useResource } from 'rest-hooks';
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
import { Separator, UserItems } from 'calendar/dashboard/Modal';
import { StyledColor } from 'calendar/appointment/create/Details';
import { PrimaryButton } from 'shared/buttons';
import { EventResource, EventMemberResource } from 'resources/EventResource';
import { GroupResource, Role, GroupEventResource } from 'resources/GroupResource';
import { Avatar } from 'calendar/appointment/create/StudentSelection';
import { FaUserCircle } from 'react-icons/fa';
import { Item } from 'groups/group/Page';
import { DropdownSelect } from 'calendar/dashboard/Items';
import { UserResource } from 'resources/UserResource';

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

const Edit: React.FC<RouteComponentProps & { eventId?: string }> = ({ eventId }) => {
    const event = useResource(EventResource.detailShape(), { id: eventId });

    const [existingUsers, setExistingUsers] = useState<EventMemberResource[]>(event.eventRoster || []);
    const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<GroupResource[]>([]);

    const updateMember = useFetcher(EventMemberResource.partialUpdateShape());

    const handleDeleteBtnClick = (item: UserResource | GroupResource): void => {
        if (item instanceof UserResource) {
            return setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== item.id));
        }

        return setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup.id !== item.id));
    };

    const handleRoleChange = (user: EventMemberResource) => async ({
        currentTarget,
    }: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const role = currentTarget.value as Role;
        await updateMember(
            { id: user.id, eventId },
            {
                role,
            },
        );

        const users = existingUsers.map(ex => {
            if (ex.id === user.id) {
                return { ...ex, role };
            }
            return { ...ex, role: ex.role };
        });
        setExistingUsers(users as EventMemberResource[]);
    };

    const edit = useFetcher(EventResource.partialUpdateShape());
    const create = useFetcher(GroupEventResource.createShape());

    const deleter = useFetcher(EventResource.deleteShape());

    const handleDelete = async (): Promise<void> => {
        await deleter({ id: event.id }, undefined);
        await navigate('/calendar');
    };

    return (
        <Formik
            initialValues={{
                title: event.title,
                description: event.description,
                location: '',
                startDate: moment(event.start).format('YYYY-MM-DD'),
                endDate: moment(event.end).format('YYYY-MM-DD'),
                startTime: moment(event.start).format('hh:mm'),
                endTime: moment(event.end).format('hh:mm'),
                color: (event.user && event.user.color) || '#000',
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                const start = moment(values.startDate)
                    .add(moment(values.startTime, 'HH:mm').hours(), 'hours')
                    .add(moment(values.startTime, 'HH:mm').minutes(), 'minutes')
                    .toLocaleString();
                const end = moment(values.endDate)
                    .add(moment(values.endTime, 'HH:mm').hours(), 'hours')
                    .add(moment(values.endTime, 'HH:mm').minutes(), 'minutes')
                    .toLocaleString();
                try {
                    await edit(
                        { id: eventId },
                        {
                            ...values,
                            start,
                            end,
                            eventRoster: selectedUsers as EventMemberResource[],
                        },
                    );
                    if (selectedGroups.length > 0) {
                        await Promise.all(
                            selectedGroups.map(group => create({ groupId: group.id }, { ...values, start, end })),
                        );
                    }
                    await navigate(`/calendar/events/${eventId}`);
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
                        css={eventId ? tw`lg:w-full xl:w-full` : tw`lg:w-2/3 xl:w-6/12`}
                        variant={props.status && !props.isSubmitting ? 'danger' : 'default'}
                    >
                        <ErrorMessage>{props.status}</ErrorMessage>
                        <Title css={tw`text-2xl text-center`}>Create a New Event</Title>
                        <Form autoComplete="off">
                            <FieldWithLabel type="text" name="title" id="title" label="Title" />
                            <Label>Description</Label>
                            <Editor
                                initialValue={props.values.description}
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

                            <div css={tw`my-4`}>
                                <h3>Members</h3>
                                {existingUsers &&
                                    existingUsers.map(user => (
                                        <Item key={user.id} css={tw`flex`}>
                                            <span css={tw`ml-2 mr-4`}>
                                                {user.picUrl ? (
                                                    <Avatar css={tw`w-12 h-12`} src={user.picUrl} />
                                                ) : (
                                                    <FaUserCircle css={tw`w-12 h-12`} />
                                                )}
                                            </span>
                                            <div>
                                                <div>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div css={tw`capitalize font-light`}>{user.role}</div>
                                            </div>
                                            <div css={tw`ml-4`}>
                                                <select value={user.role} onChange={handleRoleChange(user)}>
                                                    <option value="member">Member</option>
                                                    <option value="mod">Mod</option>
                                                    <option value="owner">Owner</option>
                                                </select>
                                            </div>
                                        </Item>
                                    ))}
                            </div>
                            <DropdownSelect
                                users={selectedUsers}
                                groups={selectedGroups}
                                setUsers={setSelectedUsers}
                                setGroups={setSelectedGroups}
                            />
                            <div css="grid-column-start: 2">
                                <UserItems items={selectedUsers} deleteCb={handleDeleteBtnClick} />
                                <UserItems items={selectedGroups} deleteCb={handleDeleteBtnClick} />
                            </div>
                            {event.user && event.user.role === 'owner' && (
                                <PrimaryButton variant="danger" type="button" onClick={handleDelete}>
                                    Delete Event?
                                </PrimaryButton>
                            )}
                            <StyledSubmitBtn
                                css={tw`mt-4`}
                                type="submit"
                                value="Edit Event"
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

export default Edit;
