import React, { createContext, useReducer, useContext } from 'react';
import * as client from './client';
import { Appointment } from './types';

type State = { events: Required<Appointment>[] };
type Action = { type: 'fetch_all'; payload: State } | { type: 'create_appointment'; payload: Appointment };
type Dispatch = (action: Action) => void;

const EventStateContext = createContext<State | undefined>(undefined);
const EventDispatchContext = createContext<Dispatch | undefined>(undefined);

const eventReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'fetch_all': {
            return action.payload;
        }
        /**
         * @TODO: this does nothing, make it useful or remove it. Issues:
         * 1. only the backend "creates" the appointment, we are just creating slots
         * 2. fetch_all is called immediately after creating the appointment
         * 3. could be useful if we want to make Offline happen
         */
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
        dispatch({ type: 'fetch_all', payload: { events: payload } });
        return { events: payload };
    });
};

export { EventProvider, useEventState, useEventDispatch, fetchAppointments };
