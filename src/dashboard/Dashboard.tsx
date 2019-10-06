import React from 'react';
import styled from 'styled-components/macro';
import { RouteComponentProps } from '@reach/router';
import * as theme from 'theme';
import { useAuthDispatch, logout } from 'auth/hooks';
import { Main } from 'navigation/Main';

const Dashboard: React.FC<RouteComponentProps> = () => {
    const dispatch = useAuthDispatch();

    return <Main>Your Content here</Main>;
};

export { Dashboard };
