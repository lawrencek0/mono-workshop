import { Role } from './types';

class User {
    constructor(
        public id: number,
        public username: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: Role,
    ) {}
}

export { User as UserModel };
