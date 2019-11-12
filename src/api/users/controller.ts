import { JsonController, Post, HttpError, Get, BodyParam, QueryParam } from 'routing-controllers';
import { User } from './entity/User';
import { EventRoster } from '../events/entity/EventRoster';
import { Event } from '../events/entity/Event';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Inject } from 'typedi';
import { UserRepository } from './repository';
import hashids from '../../util/hasher';
import Cognito from '../auth/cognito';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Role } from './entity/User';
type UserWithPassword = User & { password: string };
@JsonController('/users')
export class UserController {
    @Inject() private userRepository: UserRepository;
    @Inject() private cognito: Cognito;

    // @FIXME: need more security!
    @Get('/')
    async findAllByRole(@QueryParam('role') role: Role) {
        return this.userRepository.findAllByRole(role);
    }

    @Post('/')
    async create(@BodyParam('students') rawStudents: UserWithPassword[]) {
        try {
            const students = await Promise.all(
                rawStudents.map(async element => {
                    return this.userRepository.findByEmail(element.email).then(existUser => {
                        if (!existUser) {
                            return this.userRepository.saveUser(element).then(user => ({
                                ...user,
                                password: element.password,
                            }));
                        }
                        return null;
                    });
                }),
            );
            const newStudents = students.filter(student => student);
            await Promise.all(
                newStudents.map(async element => {
                    const id = element.id;
                    const hashedId = hashids.encode(id);
                    const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
                        new AmazonCognitoIdentity.CognitoUserAttribute({
                            Name: 'email',
                            Value: element.email,
                        }),
                        new AmazonCognitoIdentity.CognitoUserAttribute({
                            Name: 'custom:user_id',
                            Value: hashedId,
                        }),
                    ];

                    return new Promise((resolve, reject) =>
                        this.cognito.userPool.signUp(
                            element.email,
                            element.password,
                            attributeList,
                            null,
                            (err, _result) => {
                                if (err) {
                                    // @FIXME: what if it fails here? need a way to undo the query
                                    return reject(new HttpError(409, err.message));
                                }

                                return resolve({ id: hashedId, element });
                            },
                        ),
                    );
                }),
            );
            return newStudents;
        } catch (e) {
            throw new HttpError(e);
        }
        // a b
    }
}
