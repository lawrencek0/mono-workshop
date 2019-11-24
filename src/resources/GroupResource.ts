import { BaseResource } from './BaseResource';
import { UserResource } from './UserResource';

export type GroupUserRole = 'member' | 'mod' | 'owner';

export type GroupUser = Omit<UserResource, 'role'> & { role?: GroupUserRole };

export class GroupResource extends BaseResource {
    readonly id?: number = undefined;
    readonly name: string = '';
    readonly description?: string = '';
    readonly groupUsers?: GroupUser[] = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/groups';
}
