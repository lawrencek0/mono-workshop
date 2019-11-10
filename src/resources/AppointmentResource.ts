import { Resource, Request, AbstractInstanceType } from 'rest-hooks';
import { localStorageKey } from 'utils/storage';
import moment from 'moment';
import { UserResource } from './UserResource';

abstract class BaseResource extends Resource {
    static fetchPlugin = (request: Request) =>
        request.set('idtoken', localStorage.getItem(localStorageKey('accessToken')) || '');
}

export class DetailResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly description?: string = '';
    readonly slots: Required<SlotResource>[] = [];

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/appointments';
}

export class SlotResource extends BaseResource {
    readonly id?: number = undefined;
    readonly start: moment.MomentInput = '';
    readonly end: moment.MomentInput = '';
    readonly student: InstanceType<typeof UserResource> | null | boolean = null;

    pk(): number | undefined {
        return this.id;
    }

    static getKey(): string {
        return 'SlotResource';
    }

    static url<T extends typeof Resource>(
        this: T,
        urlParams?: { detailId: string } & Partial<AbstractInstanceType<T>>,
    ): string {
        if (urlParams) {
            if (this.pk(urlParams) !== undefined) {
                return `/api/appointments/${urlParams.detailId}/${this.pk(urlParams)}`;
            }
        }
        throw new Error('Slots require detailId to retrieve');
    }
}
