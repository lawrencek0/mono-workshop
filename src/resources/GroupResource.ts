import { Resource } from 'rest-hooks';
import { AbstractInstanceType } from 'rest-hooks/lib/types';
import { BaseResource } from './BaseResource';
import { UserResource } from './UserResource';

export type Role = 'member' | 'mod' | 'owner';

export class GroupResource extends BaseResource {
    readonly id?: number = undefined;
    readonly name: string = '';
    readonly description?: string = '';
    readonly user?: GroupResource = undefined;
    readonly groupUsers?: GroupUserResource[] = undefined;
    readonly posts?: GroupPostResource[] = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/groups';
}

export class GroupUserResource extends BaseResource {
    readonly id?: number = undefined;
    readonly firstName: string = '';
    readonly lastName: string = '';
    readonly email: string = '';
    readonly role?: Role = undefined;
    readonly picUrl?: string = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static getKey(): string {
        return 'GroupUserResource';
    }

    static url<T extends typeof Resource>(
        this: T,
        urlParams?: { groupId: string } & Partial<AbstractInstanceType<T>>,
    ): string {
        if (urlParams) {
            if (this.pk(urlParams) !== undefined) {
                return `${GroupResource.urlRoot}/${urlParams.groupId}/members/${this.pk(urlParams)}`;
            }
        }

        throw new Error('Group Users require groupId to retrieve');
    }

    static listUrl<T extends typeof Resource>(
        this: T,
        searchParams?: { groupId: string } & Readonly<Record<string, string | number>>,
    ): string {
        if (searchParams && Object.keys(searchParams).length) {
            const { groupId, ...realSearchParams } = searchParams;
            const params = new URLSearchParams(realSearchParams as Record<string, string>);
            params.sort();
            return `${GroupResource.urlRoot}/${groupId}/members/?${params.toString()}`;
        }
        throw new Error('Group Users require groupId to retrieve');
    }
}

export class GroupPostResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly contents?: string = undefined;
    readonly poster?: UserResource = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static getKey(): string {
        return 'GroupPostResource';
    }

    static url<T extends typeof Resource>(
        this: T,
        urlParams?: { groupId: string } & Partial<AbstractInstanceType<T>>,
    ): string {
        if (urlParams) {
            if (this.pk(urlParams) !== undefined) {
                return `${GroupResource.urlRoot}/${urlParams.groupId}/posts/${this.pk(urlParams)}`;
            }
        }

        throw new Error('Posts require groupId to retrieve');
    }

    static listUrl<T extends typeof Resource>(
        this: T,
        searchParams?: { groupId: string } & Readonly<Record<string, string | number>>,
    ): string {
        if (searchParams && Object.keys(searchParams).length) {
            const { groupId, ...realSearchParams } = searchParams;
            const params = new URLSearchParams(realSearchParams as Record<string, string>);
            params.sort();
            return `${GroupResource.urlRoot}/${groupId}/posts/?${params.toString()}`;
        }
        throw new Error('Posts require groupId to retrieve');
    }
}
