import { join } from 'path';
import compression from 'compression';
import Container from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers';
import 'reflect-metadata';

ormUseContainer(Container);
routingUseContainer(Container);

// Create Express server
const app = createExpressServer({
    controllers: [join(process.cwd(), 'dist', '/api/**/controller.js')],
    routePrefix: '/api',
});

// Express configuration
app.set('port', process.env.PORT || 8000);
app.use(compression());

export default app;
