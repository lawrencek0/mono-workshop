import { UserModel } from '../user/model';

export type UserPayload = Partial<UserModel> & {
    accessToken?: string;
    refreshToken?: string;
};
