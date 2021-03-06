import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { StyledSubmitBtn, StyledLabel } from 'shared/inputs/styles';
import { Formik, Form } from 'formik';
import { Field } from 'shared/inputs/Field';
import { Title } from 'shared/cards/styles';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { UserResource } from 'resources/UserResource';
import { useFetcher } from 'rest-hooks';
import { Separator, UserItems } from 'calendar/dashboard/Modal';
import { DropdownSelect, Menu, Item } from 'calendar/dashboard/Items';
import { ErrorMessage, Wrapper } from 'auth/Login';
import { GroupResource, GroupUserResource } from 'resources/GroupResource';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';

const schema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().notRequired(),
});

type MoodleFormat = {
    'First name': string;
    'Last name': string;
    'Email address': string;
};

export const processFile = (file: File, cb: (users: UserResource[]) => unknown): void => {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
        if (!target) return;
        const data = (target as FileReader).result;
        if (!data) return;
        const buffer = new Uint8Array(data as ArrayBuffer);
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const users = XLSX.utils.sheet_to_json(worksheet).map(props => {
            const { 'First name': firstName, 'Last name': lastName, 'Email address': email } = props as MoodleFormat;
            const role = /^[A-Z0-9]+(@warhawks.ulm.edu)$/i.test(email) ? 'student' : 'faculty';
            return UserResource.fromJS({ firstName, lastName, email, role });
        });
        cb(users);
    };
    reader.readAsArrayBuffer(file);
};

const Create: React.FC<RouteComponentProps> = ({ navigate }) => {
    const create = useFetcher(GroupResource.createShape());
    const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);
    const [usersFromFile, setUsersFromFile] = useState<UserResource[]>([]);
    // @TODO: create group from groups
    const [groups, setGroups] = useState<GroupResource[]>([]);

    const handleDelete = (item: UserResource | GroupResource): void => {
        if (item instanceof UserResource) {
            return setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== item.id));
        }

        return setGroups(groups.filter(selectedGroup => selectedGroup.id !== item.id));
    };

    const handleUsersFromFileDelete = (item: UserResource | GroupResource): void => {
        if (item instanceof UserResource) {
            return setUsersFromFile(usersFromFile.filter(user => user.email !== item.email));
        }
    };

    const handleFile = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>): void => {
        setUsersFromFile([]);

        if (!files) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                processFile(file, users => {
                    setUsersFromFile(u => u.concat(users));
                });
            }
        }
    };

    return (
        <Formik
            initialValues={
                {
                    name: '',
                    description: '',
                } as Yup.InferType<typeof schema>
            }
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                actions.setStatus();

                if (!selectedUsers.length && !usersFromFile.length) {
                    return actions.setStatus("Can't have a group by yourself");
                }

                try {
                    const groupUsers = [...selectedUsers, ...usersFromFile].reduce((unique, item) => {
                        if (unique.has(item.email)) {
                            return unique;
                        }
                        unique.set(item.email, item as GroupUserResource);
                        return unique;
                    }, new Map<string, GroupUserResource>());

                    const group = await create({}, { ...values, groupUsers: Array.from(groupUsers.values()) });
                    if (navigate) {
                        await navigate(`../${group.id}`);
                    }
                } catch (e) {
                    actions.setSubmitting(false);
                    const msg = e.response.body ? e.response.body.message : e.response.text;
                    actions.setStatus(JSON.stringify(msg));
                }
            }}
        >
            {props => {
                const isDisabled = !props.isValid || props.isSubmitting;
                return (
                    <Wrapper
                        css={tw`lg:w-2/3 xl:w-6/12`}
                        variant={props.status && !props.isSubmitting ? 'danger' : 'default'}
                    >
                        <Title css={tw`text-2xl text-center`}>Create a new group</Title>
                        <Form>
                            <ErrorMessage>{props.status}</ErrorMessage>
                            <Field type="text" name="name" id="name" label="Group Name" />
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
                            <Separator aria-hidden css={tw`my-4`} />
                            <StyledLabel css={tw`text-gray-700`}>Search for users</StyledLabel>
                            <StyledDropdown
                                groups={groups}
                                setGroups={setGroups}
                                users={selectedUsers}
                                setUsers={setSelectedUsers}
                            />
                            <div css={tw`my-4`}>
                                <UserItems items={selectedUsers} deleteCb={handleDelete} />
                            </div>
                            <Separator aria-hidden css={tw`my-4`} />
                            <Field
                                type="file"
                                name="memberFile"
                                id="memberFile"
                                label="Add Users from Files"
                                onChange={handleFile}
                                multiple
                            />
                            <div css={tw`my-4`}>
                                <UserItems items={usersFromFile} deleteCb={handleUsersFromFileDelete} />
                            </div>
                            <StyledSubmitBtn
                                type="submit"
                                value="Create Group"
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

export const StyledDropdown = styled(DropdownSelect)`
    input {
        ${tw`border-0 focus:outline-none focus:shadow-outline hover:bg-transparent 
            focus:bg-transparent shadow appearance-none rounded w-full py-2 px-3 
            text-gray-700 leading-tight`}
    }

    ${/*sc-sel*/ Menu} {
        ${tw`w-1/2`}
    }

    ${/*sc-sel*/ Item} {
        ${tw`shadow rounded`}
        background: var(--color-bg-card);
    }
`;

export default Create;
