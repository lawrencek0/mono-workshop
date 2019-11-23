import { Resource, Request } from 'rest-hooks';
import { localStorageKey } from 'utils/storage';

export abstract class BaseResource extends Resource {
    static fetchPlugin = (request: Request) =>
        request.set('idtoken', localStorage.getItem(localStorageKey('accessToken')) || '');
}
