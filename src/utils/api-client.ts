import { localStorageKey } from './storage';

// @TODO: Look into AbortController
export const apiClient = async <T>(
    endpoint: string,
    { body, ...customConfig }: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> => {
    const token = localStorage.getItem(localStorageKey('accessToken'));
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (token) {
        headers.append('idtoken', token);
    }

    const config: RequestInit = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers,
        body: JSON.stringify(body),
    };

    const res = await fetch(`/api/${endpoint}`, config);

    if (!res.ok) {
        throw new Error(res.statusText);
    }
    const { type, ...data } = await res.json();

    if (type === 'error') {
        throw new Error(data);
    }

    return data as T;
};
