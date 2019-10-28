import { User } from 'user/types';

export type UserPayload = Partial<User> & {
    accessToken?: string;
    refreshToken?: string;
};
