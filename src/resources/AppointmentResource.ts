import { Resource, Request, AbstractInstanceType, ReadShape, SchemaList } from 'rest-hooks';
import { localStorageKey } from 'utils/storage';
import moment from 'moment';
import { UserResource } from './UserResource';

abstract class BaseResource extends Resource {
    static fetchPlugin = (request: Request) =>
        request.set('idtoken', localStorage.getItem(localStorageKey('accessToken')) || '');
}

export class AppointmentResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly description?: string = '';
    readonly faculty?: UserResource = undefined;
    readonly slots?: SlotResource[] = undefined;
    readonly students?: Partial<UserResource>[] = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/appointments';

    static listByUntaken<T extends typeof Resource>(
        this: T,
    ): ReadShape<SchemaList<Required<Readonly<AbstractInstanceType<T>>>>> {
        return {
            ...this.listShape(),
            getFetchKey: () => {
                return `/api/appointments/details/untaken`;
            },
            fetch: async () => {
                return this.fetch('get', `/api/appointments/details/untaken`);
            },
            options: {
                dataExpiryLength: 100,
            },
        };
    }
}

export class SlotResource extends BaseResource {
    readonly id: number = 0;
    readonly start: moment.MomentInput = '';
    readonly end: moment.MomentInput = '';
    readonly student?: InstanceType<typeof UserResource> | null | boolean = null;

    pk(): number {
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
