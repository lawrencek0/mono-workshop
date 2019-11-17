import { check } from 'express-validator';
import {
    JsonController,
    Post,
    BodyParam,
    NotFoundError,
    UseBefore,
    Body,
    HttpError,
    UnauthorizedError,
} from 'routing-controllers';
import { Inject } from 'typedi';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { UserRepository } from '../users/repository';
import { User } from '../users/entity/User';
import hashids from '../../util/hasher';
import Cognito from './cognito';

export const validateLogin = [
    check('email', 'Invalid email')
        .not()
        .isEmpty(),
    check('password', 'Invalid password')
        .not()
        .isEmpty(),
];

export const validateSignup = [
    ...validateLogin,
    check('firstName', "First Name can't be empty").exists(),
    check('lastName', "Last Name can't be empty").exists(),
    // @TODO: allow only warhawk.ulm.edu and ulm.edu emails!
    check('email')
        .exists()
        .withMessage("Email can't be empty")
        .bail()
        .isEmail()
        .withMessage('Invald Email')
        .bail()
        .normalizeEmail(),
    check('role')
        .exists()
        .withMessage("Role can't be empty")
        .bail()
        .isIn(['student', 'faculty', 'admin'])
        .withMessage('Invalid Role'),
];

/**
 * POST /login
 * Sign in using email and password.
 */
@JsonController('/auth')
export class AuthController {
    @Inject() private userRepository: UserRepository;
    @Inject() private cognito: Cognito;

    @Post('/login')
    @UseBefore(...validateLogin)
    async login(
        @BodyParam('email', { required: true }) email: string,
        @BodyParam('password', { required: true }) password: string,
    ) {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password,
        });
        const userData = {
            Username: email,
            Pool: this.cognito.userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        return new Promise((resolve, reject) =>
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async result => {
                    const { id, ...user } = await this.userRepository.findByEmail(email);
                    const hashedId = hashids.encode(id);

                    if (!user) {
                        return reject(new NotFoundError('User not found'));
                    }

                    const idToken = result.getIdToken().getJwtToken();
                    const refreshToken = result.getRefreshToken().getToken();

                    return resolve({
                        accessToken: idToken,
                        refreshToken,
                        user: {
                            ...user,
                            id: hashedId,
                        },
                    });
                },
                onFailure: err => {
                    reject(new NotFoundError(err.message));
                },
            }),
        );
    }

    /**
     * POST /signup
     * Create a new local account.
     */
    @Post('/signup')
    @UseBefore(...validateSignup)
    async signup(@Body() user: User, @BodyParam('password', { required: true }) password: string) {
        try {
            const { id } = await this.userRepository.saveUser(user);

            const hashedId = hashids.encode(id);

            const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
                new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: 'email',
                    Value: user.email,
                }),
                new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: 'custom:user_id',
                    Value: hashedId,
                }),
            ];

            return new Promise((resolve, reject) =>
                this.cognito.userPool.signUp(user.email, password, attributeList, null, (err, _result) => {
                    if (err) {
                        // @FIXME: what if it fails here? need a way to undo the query
                        return reject(new HttpError(409, err.message));
                    }

                    return resolve({ id: hashedId, user });
                }),
            );
        } catch (e) {
            throw new HttpError(409, e);
        }
    }

    @Post('/refresh')
    async refresh(@BodyParam('idToken') idToken: string, @BodyParam('refreshToken') refreshToken: string) {
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken });
        const sessionData = {
            IdToken: '',
            RefreshToken,
            Pool: this.cognito.userPool,
            Username: '',
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(sessionData);

        return new Promise((resolve, reject) =>
            cognitoUser.refreshSession(RefreshToken, (err, session: AmazonCognitoIdentity.CognitoUserSession) => {
                if (err) reject(new UnauthorizedError(err));

                return resolve({ idToken: session.getIdToken().getJwtToken() });
            }),
        );
    }
}
