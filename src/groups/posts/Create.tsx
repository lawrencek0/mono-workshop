import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useResource, useFetcher } from 'rest-hooks';
import { GroupResource, GroupPostResource } from 'resources/GroupResource';
import { Formik, Form, Field } from 'formik';
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

const schema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
    groupId: Yup.number().required(),
});

const Post: React.FC<RouteComponentProps & { groupId?: string }> = ({ groupId }) => {
    const create = useFetcher(GroupPostResource.createShape());
    const groups = useResource(GroupResource.listShape(), {});

    return (
        <Formik
            initialValues={{
                title: '',
                contents: '',
                groupId: groupId || groups[0].id,
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                try {
                    await create({ groupId: values.groupId }, { ...values });
                    await navigate(`/groups/${values.groupId}`);
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
                        css={groupId ? tw`lg:w-full xl:w-full` : tw`lg:w-2/3 xl:w-6/12`}
                        variant={props.status && !props.isSubmitting ? 'danger' : 'default'}
                    >
                        <ErrorMessage>{props.status}</ErrorMessage>
                        <Title css={tw`text-2xl text-center`}>Create a new post</Title>
                        <Form>
                            <FieldWithLabel type="text" name="title" id="title" label="Post Title" />
                            <Label>Contents</Label>
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
                                    props.setFieldValue('contents', e.target.getContent());
                                }}
                            />
                            {!groupId && (
                                <div>
                                    <Label htmlFor="groupId">Posting in</Label>
                                    <Field as="select" id="groupId" name="groupId">
                                        {groups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                            )}
                            <StyledSubmitBtn
                                css={tw`mt-4`}
                                type="submit"
                                value="Create Post"
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
