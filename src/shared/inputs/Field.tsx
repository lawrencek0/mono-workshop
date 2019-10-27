import React from 'react';
import { ErrorMessage, useField } from 'formik';
import { MdWarning } from 'react-icons/md';
import { ThemeProvider } from 'styled-components';
import { InputWrapper, StyledLabel, StyledInput, InputErrorMsg, Icon } from './styles';

export type Props = {
    label: string;
    id: string;
    name: string;
    type: string;
    as?: 'input' | 'textarea';
};

const StyledField: React.FC<Props> = ({ id, name, label, ...props }) => {
    const [field, meta] = useField(name);
    const variant = meta.touched && meta.error ? 'danger' : 'default';

    return (
        <ThemeProvider theme={{ variant }}>
            <InputWrapper>
                <StyledLabel htmlFor={id}>{label}</StyledLabel>
                <StyledInput id={id} {...field} {...props} />
                <ErrorMessage
                    name={name}
                    render={msg => (
                        <InputErrorMsg>
                            <Icon as={MdWarning} />
                            {msg}
                        </InputErrorMsg>
                    )}
                />
            </InputWrapper>
        </ThemeProvider>
    );
};

export { StyledField as Field };
