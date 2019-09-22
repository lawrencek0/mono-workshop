import { apiClient } from '../utils/api-client';
import { UserPayload } from '../login/types';
import { localStorageKey } from '../utils/storage';

export type Credentials = {
    email: string;
    password: string;
};

const login = async ({ email, password }: Credentials): Promise<Required<UserPayload>> => {
    const { accessToken, refreshToken, ...user }: Required<UserPayload> = await apiClient('auth/login', {
        body: { email, password },
    });
    localStorage.setItem(localStorageKey('accessToken'), accessToken);
    localStorage.setItem(localStorageKey('refreshToken'), refreshToken);
    localStorage.setItem(localStorageKey('user'), JSON.stringify(user));
    return { accessToken, refreshToken, ...user };
};

const logout = async (): Promise<void> => {
    localStorage.removeItem(localStorageKey('accessToken'));
    localStorage.removeItem(localStorageKey('refreshToken'));
    // @TODO: call api endpoint
};

export { login, logout };
