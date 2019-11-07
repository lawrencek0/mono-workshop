import { User } from 'user/types';

export type UserPayload = {
    accessToken: string;
    refreshToken: string;
    user: User;
};
