import request from 'request';
import JwtHeader from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const globalAny: any = global;
globalAny.fetch = require('node-fetch');

globalAny.navigator = (): null => null;

import AmazonCognitoIdentity, { AuthenticationDetails } from 'amazon-cognito-identity-js';
import { validate } from '@babel/types';
const poolData = {
   UserPoolId: 'us-east-2_sUvdkljX3',
   ClientId: '1fj90vqgl1h20u682vsfvi30s7'
};

const poolRegion = 'us-east-2';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

//exports the registration authentication
exports.Register = function (body: { name: any; email: any; password: any }, callback: { (arg0: any): void; (arg0: any, arg1: any): void }) {
   const name = body.name;
   const email = body.email;
   const password = body.password;
   const attributeList = [];
   
   attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }));   
   
   userPool.signUp(name, password, attributeList, null, function (err: any, result: { user: any }) {
     if (err)
         callback(err);     const cognitoUser = result.user;
     callback(null, cognitoUser);
   });
};

//exports the log in authentication
exports.Login = function (body: { name: any; password: any }, callback: { (arg0: any, arg1: any): void; (arg0: any): void }) {
    const userName = body.name;
    const password = body.password;
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
         Username: userName,
         Password: password
     });    
        const userData = {
         Username: userName,
         Pool: userPool
     };    
     const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
         
     cognitoUser.authenticateUser(authenticationDetails, {
         onSuccess: function (result: { getAccessToken: () => { getJwtToken: () => void }}){
            const accesstoken = result.getAccessToken().getJwtToken();
            callback(null, accesstoken);
         },
         onFailure: (function (err: any) {
            callback(err);       
        })
    });
 };

 
 exports.Validate = function(req: { headers: { [x: string]: any } }, res: { status: { (arg0: number): void; (arg0: number): void; (arg0: number): void; (arg0: number): void }; send: { (arg0: string): void; (arg0: string): void; (arg0: string): void; (arg0: string): void } }, next: () => void){const token = req.headers['authorization'];
 request({
        url : `https://cognitoidp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json : true
     }, function(error, response, body){
        if (!error && response.statusCode === 200) {
            const pems: { [s: string]: any } = {}; 
            const keys = body['keys'];
            for(let i = 0; i < keys.length; i++) {
                 const keyId = keys[i].kid;
                 const modulus = keys[i].n;
                 const exponent = keys[i].e;
                 const keyType = keys[i].kty;
                 const jwk = { kty: keyType, n: modulus, e: exponent};
                 const pem = jwkToPem(jwk);
                 pems[keyId] = pem;
            }           const decodedJwt = jwt.decode(token, {complete: true});
                 if (!decodedJwt) {
                     console.log('Not a valid JWT token');
                     res.status(401);
                     return res.send('Invalid token');
                }            
                 const kid = (decodedJwt as any).header.kid;
                 const pem = pems[kid];
                 if (!pem) {
                     console.log('Invalid token');
                     res.status(401);
                     return res.send('Invalid token');              
                 }            jwt.verify(token, pem, function(err: any, payload: any) {
                     if(err) {
                         console.log('Invalid Token.');
                         res.status(401);
                         return res.send('Invalid token');                    } else {
                          console.log('Valid Token.');
                          return next();
                     }
                });
        } else {
              console.log('Error! Unable to download JWKs');
              res.status(500);
              return res.send('Error! Unable to download JWKs');       
            }
    });
 };
 export default exports;