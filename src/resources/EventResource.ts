import { UserResource } from './UserResource';
import { BaseResource } from './BaseResource';

export class EventResource extends BaseResource {
    readonly id?: number = undefined;
    readonly title: string = '';
    readonly description?: string = '';
    readonly location?: string = '';
    readonly start?: Date = undefined;
    readonly end?: Date = undefined;
    readonly owner?: UserResource = undefined;
    readonly users?: UserResource[] = undefined;
    readonly userProps?: {
        hexColor: string;
    } = undefined;

    pk(): number | undefined {
        return this.id;
    }

    static urlRoot = '/api/events';
}
