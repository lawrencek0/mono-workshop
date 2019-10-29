import React from 'react';
import { ErrorMessage } from 'formik';
import { MdWarning } from 'react-icons/md';
import { InputErrorMsg, Icon } from './styles';
import { IconType } from 'react-icons/lib/cjs';

type Props = {
    name: string;
    icon?: IconType;
};

const StyledErrorMessage: React.FC<Props> = ({ name, icon = MdWarning }) => {
    return (
        <ErrorMessage
            name={name}
            render={msg => (
                <InputErrorMsg>
                    <Icon as={icon} />
                    {msg}
                </InputErrorMsg>
            )}
        />
    );
};

export { StyledErrorMessage as ErrorMessage };
