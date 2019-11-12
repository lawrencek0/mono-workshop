import { Service } from 'typedi';
import { User, Role } from './entity/User';
import { Repository, Connection } from 'typeorm';
import { InjectRepository, InjectConnection } from 'typeorm-typedi-extensions';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import hashids from '../../util/hasher';
import Cognito from '../auth/cognito';
import { HttpError } from 'routing-controllers';

type UserWithPassword = User & { password: string };

@Service()
export class UserRepository {
    @InjectRepository(User)
    private repository: Repository<User>;
    @InjectConnection()
    private connection: Connection;

    findById(id: number) {
        return this.repository.findOne(id);
    }

    findAllByIds(ids: number[]) {
        return this.repository.findByIds(ids);
    }

    findByEmail(email: string) {
        return this.repository.findOne({ email });
    }

    findAllById(userIds: number[]) {
        return this.repository.findByIds(userIds);
    }

    findAllByRole(role: Role) {
        return this.repository.find({ role });
    }

    saveUser(user: User) {
        return this.repository.save(user);
    }
    saveUsers(users: User[]) {
        return this.repository.save(users);
    }
    async saveNewUsers(users: UserWithPassword[]) {
        // Save new users in the database
        return await Promise.all(
            users.map(async element => {
                return this.findByEmail(element.email).then(existUser => {
                    if (!existUser) {
                        return this.saveUser(element).then(user => ({
                            ...user,
                            password: element.password,
                        }));
                    }
                    return null;
                });
            }),
        );
    }

    async saveUsersInIncognito(users: UserWithPassword[], cognito: Cognito) {
        await Promise.all(
            users.map(async element => {
                const id = element.id;
                const hashedId = hashids.encode(id);
                const attributeList: CognitoUserAttribute[] = [
                    new CognitoUserAttribute({
                        Name: 'email',
                        Value: element.email,
                    }),
                    new CognitoUserAttribute({
                        Name: 'custom:user_id',
                        Value: hashedId,
                    }),
                ];

                return new Promise((resolve, reject) =>
                    cognito.userPool.signUp(element.email, element.password, attributeList, null, (err, _result) => {
                        if (err) {
                            // @FIXME: what if it fails here? need a way to undo the query
                            return reject(new HttpError(409, err.message));
                        }

                        return resolve({ id: hashedId, element });
                    }),
                );
            }),
        );
    }
    userGroup(groupIds: number[]) {
        return this.repository
            .find({ relations: ['group.group', 'group'] })
            .then(users =>
                users.filter(user =>
                    user.group.some(group => (group.group ? groupIds.includes(group.group.id) : false)),
                ),
            );
    }
}
