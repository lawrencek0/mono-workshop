import React from 'react';
import { useField } from 'formik';
import { ThemeProvider } from 'styled-components/macro';
import tw from 'tailwind.macro';
import { InputWrapper, StyledLabel, StyledInput } from './styles';
import { ErrorMessage } from './ErrorMessage';
import { IconType } from 'react-icons/lib/cjs';

export type Props = {
    label: string;
    id: string;
    name: string;
    type: string;
    as?: 'input' | 'textarea';
    icon?: IconType;
    labelHidden?: boolean;
    [key: string]: unknown;
};

const StyledField: React.FC<Props> = ({ id, name, label, icon, labelHidden, ...props }) => {
    const [field, meta] = useField(name);
    const variant = meta.touched && meta.error ? 'danger' : 'default';

    return (
        <ThemeProvider theme={{ variant }}>
            <InputWrapper>
                <StyledLabel css={labelHidden ? tw`hidden` : 'block'} htmlFor={id}>
                    {label}
                </StyledLabel>
                <StyledInput id={id} {...field} {...props} />
                <ErrorMessage name={name} icon={icon} />
            </InputWrapper>
        </ThemeProvider>
    );
};

export { StyledField as Field };
