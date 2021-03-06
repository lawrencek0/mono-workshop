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
    CurrentUser,
} from 'routing-controllers';
import { Inject } from 'typedi';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { UserRepository } from '../users/repository';
import { User } from '../users/entity/User';
import hashids from '../../util/hasher';
import Cognito from './cognito';
import AWS from 'aws-sdk';

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
        @BodyParam('newPassword') newPassword: string,
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
                    const accessToken = result.getAccessToken().getJwtToken();

                    return resolve({
                        accessToken,
                        idToken,
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
                newPasswordRequired: () => {
                    cognitoUser.completeNewPasswordChallenge(newPassword, undefined, {
                        onSuccess: () => {
                            return resolve('Password changed successfully');
                        },
                        onFailure: err => {
                            return reject(err.message);
                        },
                    });
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

    // route for refreshing the user's session tokens
    @Post('/refresh')
    async refresh(@BodyParam('refreshToken') refreshToken: string) {
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken });
        const sessionData = {
            IdToken: '',
            RefreshToken,
            Pool: this.cognito.userPool,
            Username: '',
        };

        // gets the current cognito user
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(sessionData);

        // refreshes the current user's tokens
        return new Promise((resolve, reject) =>
            cognitoUser.refreshSession(RefreshToken, (err, session: AmazonCognitoIdentity.CognitoUserSession) => {
                if (err) reject(new UnauthorizedError(err));

                return resolve({ idToken: session.getIdToken().getJwtToken() });
            }),
        );
    }

    // @FIXME: we may not need this. Using the OTP at the first log in should verify the email
    @Post('/verify')
    async confirmEmail(@BodyParam('email') email: string, @BodyParam('code') code: string) {
        // create
        const cogIDP = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-2' });
        return cogIDP.confirmSignUp(
            { ClientId: this.cognito.userPool.getClientId(), ConfirmationCode: code, Username: email },
            (err, data) => {
                if (err) console.log('it broke ' + err);
                else console.log('Success! ' + data);
            },
        );
    }

    // user selects 'Forgot password' and enters their email
    // a verification code is sent to that email
    @Post('/forgotPassword')
    async forgotPass(@BodyParam('email') email: string) {
        const userData = {
            Username: email,
            Pool: this.cognito.userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        return new Promise((resolve, reject) =>
            cognitoUser.forgotPassword({
                // onSuccess sends the confirmation code
                onSuccess: data => {
                    return resolve(data);
                },
                onFailure: err => {
                    return reject(new Error(err.message));
                },
            }),
        );
    }

    // follow up to forgotPassword
    // user enters the code sent to their email and then creates a new password
    @Post('/recovery')
    async passwordRecovery(
        @BodyParam('code') code: string,
        @BodyParam('newPassword') newPassword: string,
        @BodyParam('email') email: string,
    ) {
        const userData = {
            Username: email,
            Pool: this.cognito.userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        return new Promise((resolve, reject) =>
            // onSuccess updates the password
            cognitoUser.confirmPassword(code, newPassword, {
                onSuccess: () => {
                    return resolve('Success!');
                },
                onFailure: err => {
                    return reject(new Error(err.message));
                },
            }),
        );
    }
    // allows the user to change password if they are already signed in
    // requires that they also know the old password
    @Post('/password')
    async resetPassword(
        @CurrentUser({ required: true }) user: User,
        @BodyParam('oldPassword') oldPassword: string,
        @BodyParam('code') code: string,
        @BodyParam('newPassword') newPassword: string,
        @BodyParam('accessToken') accToken: string,
    ) {
        const cogIDP = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-2' });

        return new Promise((resolve, reject) =>
            cogIDP.changePassword(
                {
                    AccessToken: accToken,
                    PreviousPassword: oldPassword,
                    ProposedPassword: newPassword,
                },
                (err, _data) => {
                    if (err) return reject(new Error(err.message));

                    return resolve('Success changing password');
                },
            ),
        );
    }
}
