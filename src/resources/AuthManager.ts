/* eslint-disable @typescript-eslint/no-explicit-any */
import { Manager, MiddlewareAPI } from 'rest-hooks';
import { localStorageKey } from 'utils/storage';
import { navigate } from '@reach/router';

type Dispatch<R extends React.Reducer<any, any>> = (action: React.ReducerAction<R>) => Promise<void>;

export class AuthManager implements Manager {
    // @TODO: may cause issues with multiple requests see that when we get group
    private originalAction: any;

    cleanup(): void {
        this.originalAction = undefined;
    }

    getMiddleware<T extends AuthManager>(this: T) {
        return <R extends React.Reducer<any, any>>({ dispatch }: MiddlewareAPI<R>) => {
            return (next: Dispatch<R>) => (action: React.ReducerAction<R>): Promise<void> => {
                switch (action.type) {
                    case 'rest-hooks/fetch':
                        this.originalAction = { ...action };
                        return next(action);
                    case 'rest-hooks/purge':
                    case 'rest-hooks/rpc':
                    case 'rest-hooks/receive':
                        if (
                            action.error &&
                            action.payload.status === 401 &&
                            action.payload.response.body.message.name === 'TokenExpiredError'
                        ) {
                            const refreshToken = localStorage.getItem(localStorageKey('refreshToken'));
                            if (!refreshToken) {
                                navigate('/logout');
                            } else {
                                return fetch('/api/auth/refresh', {
                                    method: 'post',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ refreshToken }),
                                })
                                    .then(res => res.json())
                                    .then(body => {
                                        localStorage.setItem(localStorageKey('accessToken'), body.idToken);
                                        return dispatch({
                                            ...this.originalAction,
                                            error: undefined,
                                            meta: {
                                                ...this.originalAction.meta,
                                                schema: action.meta.schema,
                                                throttle: false,
                                            },
                                            payload: () =>
                                                fetch(action.payload.response.req.url, {
                                                    ...action.payload.response.req,
                                                    headers: new Headers({
                                                        idtoken: body.idToken,
                                                    }),
                                                })
                                                    .then(res => res.json())
                                                    .catch(e => console.log('how could it?', e)),
                                            type: 'rest-hooks/fetch',
                                        });
                                    })
                                    .catch(e => {
                                        console.log('called here', e);
                                        navigate('/logout');
                                    });
                            }
                        }
                    // eslint-disable-next-line no-fallthrough
                    default:
                        return next(action);
                }
            };
        };
    }
}
