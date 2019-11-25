import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useResource, useFetcher } from 'rest-hooks';
import { GroupResource } from 'resources/GroupResource';
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

const schema = Yup.object({
    name: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
});

const Edit: React.FC<RouteComponentProps & { groupId?: string }> = ({ groupId }) => {
    const update = useFetcher(GroupResource.partialUpdateShape());
    const group = useResource(GroupResource.detailShape(), { id: groupId });

    return (
        <Formik
            initialValues={{
                name: group.name,
                description: group.description,
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                try {
                    await update({ id: groupId }, { ...values });
                    await navigate(`/groups/${groupId}`);
                } catch (e) {
                    console.error(e);
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
                        <Title css={tw`text-2xl text-center`}>Editing Group Info</Title>
                        <Form>
                            <FieldWithLabel type="text" name="name" id="name" label="Group Name" />
                            <Label>Description</Label>
                            <Editor
                                initialValue={group.description}
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
                            <StyledSubmitBtn
                                css={tw`mt-4`}
                                type="submit"
                                value="Update Group"
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
