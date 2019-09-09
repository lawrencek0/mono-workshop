import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import request from 'request';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import { authentic } from '../util/secrets';

(global as any).fetch = require('node-fetch');
(global as any).navigator = (): null => null;

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
  check('first_name', 'First Name can\'t be empty').exists(),
  check('last_name', 'Last Name can\'t be empty').exists(),
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
    .withMessage('Invalid Role'),
  check('cwid', 'Invalid cwid')
    .exists()
    .withMessage('CWID can\'t be empty')
    .bail()
    .isInt()
    .withMessage('Invalid CWID')
    .bail()
    .isLength({ min: 8, max: 8 })
];

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  ClientId: authentic.AWS_COGNITO_CLIENT_ID,
  UserPoolId: authentic.AWS_COGNITO_USER_USER_POOL_ID
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
    onSuccess: function(result: {
      getAccessToken: () => { getJwtToken: () => void };
    }) {
      const accesstoken = result.getAccessToken().getJwtToken();
      return res.status(200).json({ type: 'success', accesstoken });
    },
    onFailure: function(err: any) {
      return res
        .status(422)
        .json({ type: 'error', message: 'Invalid username or password.' });
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

  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [];

  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  );

  return userPool.signUp(name, password, attributeList, null, (err, result) => {
    if (err) {
      return res
        .status(422)
        .json({ type: 'error', message: 'Username is already taken' });
    }
    const cognitoUser = result.user;
    return res.status(200).json({ type: 'success', cognitoUser });
  });
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  request(
    {
      url: `https://cognitoidp.${authentic.AWS_COGNITO_POOL_REGION}.amazonaws.com/${authentic.AWS_COGNITO_USER_USER_POOL_ID}/.well-known/jwks.json`,
      json: true
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const pems: { [s: string]: string } = {};
        const keys = body['keys'];
        for (let i = 0; i < keys.length; i++) {
          const keyId = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const keyType = keys[i].kty;
          const jwk = { kty: keyType, n: modulus, e: exponent };
          const pem = jwkToPem(jwk);
          pems[keyId] = pem;
        }
        const decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          return res
            .status(401)
            .json({ type: 'error', message: 'Invalid token' });
        }
        const kid = (decodedJwt as any).header.kid;
        const pem = pems[kid];
        if (!pem) {
          return res
            .status(401)
            .json({ type: 'error', message: 'Invalid token' });
        }
        jwt.verify(token, pem, function(err: any, payload: any) {
          if (err) {
            return res
              .status(401)
              .json({ type: 'error', message: 'Invalid token' });
          } else {
            return next();
          }
        });
      } else {
        return res
          .status(500)
          .json({ type: 'error', message: 'Error! Unable to download JWKs' });
      }
    }
  );
};
