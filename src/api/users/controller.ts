import { JsonController, Post, HttpError, Get, BodyParam, QueryParam } from 'routing-controllers';
import { User } from './entity/User';
import { Inject } from 'typedi';
import { UserRepository } from './repository';
import hashids from '../../util/hasher';
import Cognito from '../auth/cognito';
import { Role } from './entity/User';
import AWS from 'aws-sdk';
import { AttributeType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

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

    // admin submits a csv file and users are created and sent a one-time password
    @Post('/')
    async create(@BodyParam('students') rawStudents: UserWithPassword[]) {
        try {
            const students = await Promise.all(
                rawStudents.map(async element => {
                    return this.userRepository.findByEmail(element.email).then(existUser => {
                        if (!existUser) {
                            return this.userRepository.saveUser(element).then(user => ({
                                ...user,
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

                    const cogIDP = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-2' });
                    const attributes: AttributeType[] = [
                        { Name: 'email', Value: element.email },
                        { Name: 'custom:user_id', Value: hashedId },
                    ];
                    return new Promise((resolve, reject) =>
                        cogIDP.adminCreateUser(
                            {
                                Username: element.email,
                                UserPoolId: this.cognito.userPool.getUserPoolId(),
                                UserAttributes: attributes,
                                DesiredDeliveryMediums: ['EMAIL'],
                            },
                            (err, _result) => {
                                if (err) return reject(new HttpError(409, err.message));

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
    }
}
