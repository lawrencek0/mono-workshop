import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { FormWrapper, StyledSubmitBtn } from 'shared/inputs/styles';
import { Formik, Form } from 'formik';
import { Field } from 'shared/inputs/Field';
import { Title } from 'shared/cards/styles';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { UserResource } from 'resources/UserResource';
import { useResource } from 'rest-hooks';
import { Separator, UserItems } from 'calendar/dashboard/Modal';
import { DropdownSelect, Menu, Item } from 'calendar/dashboard/Items';

const schema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().notRequired(),
});

type MoodleFormat = {
    'First name': string;
    'Last name': string;
    'Email address': string;
};

const processFile = (file: File, cb: (users: UserResource[]) => unknown): void => {
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

            return UserResource.fromJS({ firstName, lastName, email });
        });
        cb(users);
    };
    reader.readAsArrayBuffer(file);
};

const Create: React.FC<RouteComponentProps> = () => {
    const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);
    const [usersFromFile, setUsersFromFile] = useState<UserResource[]>([]);

    const handleUserDelete = ({ id: userId }: UserResource): void => {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== userId));
    };

    const handleUsersFromFileDelete = ({ email }: UserResource): void => {
        setUsersFromFile(usersFromFile.filter(user => user.email !== email));
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
        <FormWrapper>
            <Title css={tw`text-2xl text-center`}>Create a new group</Title>
            <Formik
                initialValues={
                    {
                        name: '',
                        description: '',
                    } as Yup.InferType<typeof schema>
                }
                validationSchema={schema}
                onSubmit={v => {
                    console.log(v);
                }}
            >
                <Form>
                    <Field type="text" name="name" id="name" label="Group Name" />
                    <Field as="textarea" type="text" name="description" id="description" label="Description" />
                    <Separator aria-hidden css={tw`my-4`} />
                    <StyledDropdown users={selectedUsers} setUsers={setSelectedUsers} />
                    <div css={tw`my-4`}>
                        <UserItems users={selectedUsers} deleteCb={handleUserDelete} />
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
                        <UserItems users={usersFromFile} deleteCb={handleUsersFromFileDelete} />
                    </div>
                    <StyledSubmitBtn type="submit" value="Create Group" />
                </Form>
            </Formik>
        </FormWrapper>
    );
};

const StyledDropdown = styled(DropdownSelect)`
    ${/*sc-sel*/ Menu} {
        ${tw`w-1/2`}
    }

    ${/*sc-sel*/ Item} {
        ${tw`shadow bg-white rounded`}
    }
`;

export default Create;
