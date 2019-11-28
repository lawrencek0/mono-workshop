import { join } from 'path';
import compression from 'compression';
import Container from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import {
    createExpressServer,
    useContainer as routingUseContainer,
    Action,
    UnauthorizedError,
} from 'routing-controllers';
import 'reflect-metadata';
import CognitoExpress from './api/auth/cognito';
import hashids from './util/hasher';
import { UserRepository } from './api/users/repository';

ormUseContainer(Container);
routingUseContainer(Container);

// Create Express server
const app = createExpressServer({
    controllers: [join(process.cwd(), 'dist', '/api/**/controller.js')],
    routePrefix: '/api',
    authorizationChecker: async (action: Action, roles: string[]) => {
        const token = action.request.headers['idtoken'];
        const cognitoExpress = Container.get(CognitoExpress);
        const cognitoUser: any = await cognitoExpress.validate(token);
        const id = hashids.decode(cognitoUser['custom:user_id'])[0] as number;
        const userRepo = Container.get(UserRepository);
        const { role } = await userRepo.findById(id);
        if (role && !roles.length) return true;
        if (roles && roles.includes(role)) return true;

        return false;
    },
    currentUserChecker: async (action: Action) => {
        try {
            const token = action.request.headers['idtoken'];
            const cognitoExpress = Container.get(CognitoExpress);
            const cognitoUser: any = await cognitoExpress.validate(token);
            const id = hashids.decode(cognitoUser['custom:user_id'])[0] as number;
            const userRepo = Container.get(UserRepository);
            return userRepo.findById(id);
        } catch (e) {
            throw new UnauthorizedError(e);
        }
    },
});

// Express configuration
app.set('port', process.env.PORT || 8000);
app.use(compression());

export default app;
