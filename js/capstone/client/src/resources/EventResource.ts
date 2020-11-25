import { UserResource } from './UserResource';
import { BaseResource } from './BaseResource';
import moment from 'moment';
import { Role } from './GroupResource';
import { Resource } from 'rest-hooks';
import { AbstractInstanceType } from 'rest-hooks/lib/types';

export class EventResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly description?: string = '';
    readonly location?: string = '';
    readonly start?: moment.MomentInput = undefined;
    readonly end?: moment.MomentInput = undefined;
    readonly owner?: UserResource = undefined;
    readonly eventRoster?: EventMemberResource[] = undefined;
    readonly color?: string = undefined;
    readonly user?: EventMemberResource = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/events';
}

export class EventMemberResource extends BaseResource {
    readonly id?: number = undefined;
    readonly firstName: string = '';
    readonly lastName: string = '';
    readonly email: string = '';
    readonly role?: Role = undefined;
    readonly picUrl?: string = undefined;
    readonly color?: string = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static getKey(): string {
        return 'EventMemberResource';
    }

    static url<T extends typeof Resource>(
        this: T,
        urlParams?: { eventId: string } & Partial<AbstractInstanceType<T>>,
    ): string {
        if (urlParams) {
            if (this.pk(urlParams) !== undefined) {
                return `${EventResource.urlRoot}/${urlParams.eventId}/members/${this.pk(urlParams)}`;
            }
        }

        throw new Error('Event Users require eventId to retrieve');
    }

    static listUrl<T extends typeof Resource>(
        this: T,
        searchParams?: { eventId: string } & Readonly<Record<string, string | number>>,
    ): string {
        if (searchParams && Object.keys(searchParams).length) {
            const { eventId, ...realSearchParams } = searchParams;
            const params = new URLSearchParams(realSearchParams as Record<string, string>);
            params.sort();
            return `${EventResource.urlRoot}/${eventId}/members/?${params.toString()}`;
        }
        throw new Error('Event Users require eventId to retrieve');
    }
}
