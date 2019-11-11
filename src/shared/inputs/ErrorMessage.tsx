import React from 'react';
import { ErrorMessage } from 'formik';
import { MdWarning } from 'react-icons/md';
import { InputErrorMsg, Icon } from './styles';
import { IconType } from 'react-icons/lib/cjs';
import { ThemeProvider } from 'styled-components';

type Props = {
    name: string;
    icon?: IconType;
};

const StyledErrorMessage: React.FC<Props> = ({ name, icon = MdWarning }) => {
    return (
        <ThemeProvider theme={{ variant: 'danger' }}>
            <ErrorMessage
                name={name}
                render={msg => (
                    <InputErrorMsg>
                        <Icon as={icon} />
                        {msg}
                    </InputErrorMsg>
                )}
            />
        </ThemeProvider>
    );
};

export { StyledErrorMessage as ErrorMessage };
