import React, { createContext, useReducer, useContext } from 'react';
import { UserPayload } from '../login/types';
import * as client from './client';
import { localStorageKey } from '../utils/storage';
import { redirectTo } from '@reach/router';

type State = UserPayload;
type Action = { type: 'login'; payload: UserPayload } | { type: 'logout' } | { type: 'refreshToken' };
type Dispatch = (action: Action) => void;

const AuthStateContext = createContext<UserPayload | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch | undefined>(undefined);

const authReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'login': {
            return { ...action.payload };
        }
        case 'logout': {
            redirectTo('/login');
            return { accessToken: undefined };
        }
        case 'refreshToken': {
            // @TODO: fetch the refresh token from localstorage and perform a request
            return state;
        }
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const accessToken = localStorage.getItem(localStorageKey('accessToken')) || undefined;
    const user = localStorage.getItem(localStorageKey('user')) || '{}';
    const [state, dispatch] = useReducer(authReducer, { accessToken, ...JSON.parse(user) });

    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

const login = (dispatch: Dispatch, creds: client.Credentials): Promise<UserPayload> => {
    return client.login(creds).then(payload => {
        dispatch({ type: 'login', payload });
        return payload;
    });
};

const logout = (dispatch: Dispatch): Promise<void> => {
    return client.logout().then(() => {
        dispatch({ type: 'logout' });
    });
};

const useAuth = (): [UserPayload, Dispatch] => {
    const state = useContext(AuthStateContext);
    const dispatch = useContext(AuthDispatchContext);

    if (state === undefined || dispatch === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return [state, dispatch];
};

export { AuthProvider, useAuth, login, logout };
