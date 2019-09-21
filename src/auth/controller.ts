import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { authentic, salt } from '../util/secrets';
import * as UserService from '../users/service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Hashids = require('hashids/cjs'); //...

//eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');
(global as any).fetch = require('node-fetch');
(global as any).navigator = (): null => null;

const hashids = new Hashids(salt, 8);

export const validateLogin = [
    check('username', 'Invalid username')
        .not()
        .isEmpty(),
    check('password', 'Invalid password')
        .not()
        .isEmpty()
];

export const validateSignup = [
    ...validateLogin,
    check('firstName', 'First Name can\'t be empty').exists(),
    check('lastName', 'Last Name can\'t be empty').exists(),
    // @TODO: allow only warhawk.ulm.edu and ulm.edu emails!
    check('email')
        .exists()
        .withMessage('Email can\'t be empty')
        .bail()
        .isEmail()
        .withMessage('Invald Email')
        .bail()
        .normalizeEmail(),
    check('role')
        .exists()
        .withMessage('Role can\'t be empty')
        .bail()
        .isIn(['student', 'faculty', 'admin'])
        .withMessage('Invalid Role')
];

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    ClientId: authentic.AWS_COGNITO_CLIENT_ID,
    UserPoolId: authentic.AWS_COGNITO_USER_POOL_ID
});

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    const userName = req.body.username;
    const password = req.body.password;
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        {
            Username: userName,
            Password: password
        }
    );
    const userData = {
        Username: userName,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            const idToken = result.getIdToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();
            return res
                .status(200)
                .json({ type: 'success', accessToken: idToken, refreshToken });
        },
        onFailure: err => {
            return res.status(422).json({ type: 'error', message: err });
        }
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const email = req.body.email;
    const password = req.body.password;

    await UserService.save({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        role: req.body.role,
        email
    });

    const { id } = await UserService.getUserByEmail(req.body.email);
    const hashedId = hashids.encode(id);

    const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: email
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'custom:user_id',
            Value: hashedId
        })
    ];

    return userPool.signUp(
        email,
        password,
        attributeList,
        null,
        (err, result) => {
            if (err) {
                return res.status(422).json({ type: 'error', message: err });
            }
            const cognitoUser = result.user;
            console.log(cognitoUser);
            return res.status(200).json({ type: 'success', cognitoUser });
        }
    );
};

//Configures the cognito-express constructor
const cognitoExpress = new CognitoExpress({
    region: authentic.AWS_COGNITO_POOL_REGION,
    cognitoUserPoolId: authentic.AWS_COGNITO_USER_POOL_ID,
    tokenUse: 'id',
    tokenExpiration: 3600000 //this is measured in ms (this is 1 hour)
});

export const validate = (req: Request, res: Response, next: NextFunction) => {
    //I'm passing in the access token in header under key accessToken
    const accessTokenFromClient = req.headers.idtoken;

    //Fail if token not present in header.
    if (!accessTokenFromClient)
        return res.status(401).send('Access Token missing from header');

    cognitoExpress.validate(
        accessTokenFromClient,
        (err: Error, response: Response) => {
            //If API is not authenticated, Return 401 with error message.
            if (err) return res.status(401).send(err);
            //Else API has been authenticated. Proceed.
            res.locals.user = response;
            next();
        }
    );
};
