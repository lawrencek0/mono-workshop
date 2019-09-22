import React from 'react';
import styled from 'styled-components/macro';
import { RouteComponentProps } from '@reach/router';
import * as theme from 'theme';
import { useAuthDispatch, logout } from 'auth/hooks';
import { Content } from 'navigation/Content';

const Dashboard: React.FC<RouteComponentProps> = () => {
    const dispatch = useAuthDispatch();

    return (
        <Content>
            <button
                onClick={() => {
                    logout(dispatch);
                }}
            >
                logout
            </button>
        </Content>
    );
};

export { Dashboard };
