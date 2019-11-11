import React, { createContext, useReducer, useContext } from 'react';
import { localStorageKey } from '../utils/storage';
import { navigate } from '@reach/router';
import { UserResource } from 'resources/UserResource';

type State = { accessToken?: string; refreshToken?: string; user: Required<InstanceType<typeof UserResource>> };
type Action = { type: 'login'; payload: Required<NonNullable<State>> } | { type: 'logout' } | { type: 'refreshToken' };
type Dispatch = (action: Action) => void;

const AuthStateContext = createContext<State | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch | undefined>(undefined);

const authReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'login': {
            const { accessToken, refreshToken, user } = action.payload;
            localStorage.setItem(localStorageKey('accessToken'), accessToken);
            localStorage.setItem(localStorageKey('refreshToken'), refreshToken);
            localStorage.setItem(localStorageKey('user'), JSON.stringify(user));

            return { ...action.payload };
        }
        case 'logout': {
            localStorage.removeItem(localStorageKey('accessToken'));
            localStorage.removeItem(localStorageKey('refreshToken'));
            localStorage.removeItem(localStorageKey('user'));
            navigate('/login', { replace: true });
            return {} as State;
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
    const refreshToken = localStorage.getItem(localStorageKey('refreshToken')) || undefined;
    const user = localStorage.getItem(localStorageKey('user'));
    const [state, dispatch] = useReducer(authReducer, {
        accessToken,
        refreshToken,
        user: user ? JSON.parse(user) : undefined,
    });

    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

const useAuthState = (): NonNullable<State> => {
    const state = useContext(AuthStateContext);

    if (state === undefined) {
        throw new Error('useAuthState must be used within a AuthProvider');
    }

    return state;
};

const useAuthDispatch = (): Dispatch => {
    const dispatch = useContext(AuthDispatchContext);

    if (dispatch === undefined) {
        throw new Error('useAuthProvider must be used within a AuthProvider');
    }

    return dispatch;
};

export { AuthProvider, useAuthState, useAuthDispatch };
