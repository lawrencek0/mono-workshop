import { Resource, SchemaDetail, AbstractInstanceType, MutateShape } from 'rest-hooks';
import { Role } from 'user/types';

export class UserResource extends Resource {
    readonly id?: number = undefined;
    readonly firstName: string = '';
    readonly lastName: string = '';
    readonly email: string = '';
    readonly role?: Role = undefined;
    readonly picUrl?: string = undefined;
    readonly bio: string = '';

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/users';

    // static fetchPlugin = (request: Request) => request.auth('', '');

    static makeLoggedInUserShape<T extends typeof Resource>(
        this: T,
    ): MutateShape<SchemaDetail<Readonly<AbstractInstanceType<T>>>> {
        return {
            ...this.createShape(),
            getFetchKey: () => {
                return '/api/auth/login';
            },
            fetch: async (params: {}, body: Readonly<{ email: 'string'; password: 'string' }>) => {
                const { accessToken, refreshToken, user } = await this.fetch('post', '/api/auth/login', body);
                return { ...user, accessToken, refreshToken };
            },
        };
    }
}
