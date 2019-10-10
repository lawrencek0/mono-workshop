import React, { createContext, useReducer, useContext } from 'react';
import { Props } from './dashboard/Card';
import * as client from './client';
import { Student } from 'utils/students-client';
import { Slot } from './types';

export type Appointment = Props & {
    slots: Required<Slot>[];
    students?: Student[];
};
export type State = { appointment: Appointment[]; selectedAppointment: Appointment[] };
type Action = { type: 'fetch_all'; payload: State } | { type: 'create_appointment'; payload: Appointment };
type Dispatch = (action: Action) => void;

const EventStateContext = createContext<State | undefined>(undefined);
const EventDispatchContext = createContext<Dispatch | undefined>(undefined);

const eventReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'fetch_all': {
            return action.payload;
        }
        case 'create_appointment': {
            return { ...state, ...action.payload };
        }
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
};

const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(eventReducer, {} as State);

    return (
        <EventStateContext.Provider value={state}>
            <EventDispatchContext.Provider value={dispatch}>{children}</EventDispatchContext.Provider>
        </EventStateContext.Provider>
    );
};

const useEventState = (): State => {
    const state = useContext(EventStateContext);

    if (state === undefined) {
        throw new Error('useEventState must be used within a EventProvider');
    }

    return state;
};

const useEventDispatch = (): Dispatch => {
    const dispatch = useContext(EventDispatchContext);

    if (dispatch === undefined) {
        throw new Error('useAUthDispatch must be used with a EventProvider');
    }

    return dispatch;
};

const fetchAppointments = (dispatch: Dispatch): Promise<State> => {
    return client.fetchAppointments().then(payload => {
        console.log(payload);
        dispatch({ type: 'fetch_all', payload });
        return payload;
    });
};

export { EventProvider, useEventState, useEventDispatch, fetchAppointments };
