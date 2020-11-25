import React, { createContext, useReducer, useContext } from 'react';
import { localStorageKey } from 'utils/storage';

type State = {
    theme: 'light' | 'dark';
};

type Action = {
    type: 'toggle';
};

type Dispatch = (action: Action) => void;

const DayNightStateContext = createContext<State | undefined>(undefined);
const DayNightDispatchContext = createContext<Dispatch | undefined>(undefined);

const themeReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'toggle': {
            const theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem(localStorageKey('theme'), theme);
            return { theme };
        }
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
};

const DayNightThemeProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const theme = (localStorage.getItem(localStorageKey('theme')) as 'light' | 'dark') || 'light';
    const [state, dispatch] = useReducer(themeReducer, { theme });

    return (
        <DayNightStateContext.Provider value={state}>
            <DayNightDispatchContext.Provider value={dispatch}>{children}</DayNightDispatchContext.Provider>
        </DayNightStateContext.Provider>
    );
};

const useDayNightThemeState = (): NonNullable<State> => {
    const state = useContext(DayNightStateContext);

    if (state === undefined) {
        throw new Error('useDayNightThemeState must be used within a AuthProvider');
    }

    return state;
};

const useDayNightThemeDispatch = (): Dispatch => {
    const dispatch = useContext(DayNightDispatchContext);

    if (dispatch === undefined) {
        throw new Error('useDayNightThemeDispatch must be used within a AuthProvider');
    }

    return dispatch;
};

export { DayNightThemeProvider, useDayNightThemeState, useDayNightThemeDispatch };
