import { Service } from 'typedi';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { authentic } from '../../util/secrets';

//eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');
(global as any).fetch = require('node-fetch');
(global as any).navigator = (): null => null;

@Service()
export default class Cognito {
    //Configures the cognito-express constructor
    private cognitoExpress = new CognitoExpress({
        region: authentic.AWS_COGNITO_POOL_REGION,
        cognitoUserPoolId: authentic.AWS_COGNITO_USER_POOL_ID,
        tokenUse: 'id',
        tokenExpiration: 3600000, //this is measured in ms (this is 1 hour)
    });

    public userPool = new AmazonCognitoIdentity.CognitoUserPool({
        ClientId: authentic.AWS_COGNITO_CLIENT_ID,
        UserPoolId: authentic.AWS_COGNITO_USER_POOL_ID,
    });

    validate(token: string) {
        return new Promise((resolve, reject) =>
            this.cognitoExpress.validate(token, (err: Error, res: Response) => {
                if (err) return reject(err);

                return resolve(res);
            }),
        );
    }
}
