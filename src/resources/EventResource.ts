import { UserResource } from './UserResource';
import { BaseResource } from './BaseResource';
import moment from 'moment';

export class EventResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly description?: string = '';
    readonly location?: string = '';
    readonly start?: moment.MomentInput = undefined;
    readonly end?: moment.MomentInput = undefined;
    readonly owner?: UserResource = undefined;
    readonly eventRoster?: UserResource[] = undefined;
    readonly color?: string = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/events';
}
