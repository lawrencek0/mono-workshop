import { BaseResource } from './BaseResource';

export class LogResource extends BaseResource {
    readonly timestamp?: string = undefined;
    readonly message?: string = '';
    readonly level?: 'info' | 'debug' | 'error' = undefined;

    pk(): string | undefined {
        return `${this.message} ${this.timestamp}`;
    }

    static urlRoot = '/api/logs';
}
