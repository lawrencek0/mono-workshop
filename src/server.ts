import errorHandler from 'errorhandler';

import app from './app';
import { createConnection } from 'typeorm';
import { database } from './util/secrets';
import logger from './util/logger';
import { User } from './user/model';
import { Slot } from './appointment/slot/models';
import { Detail } from './appointment/detail/models';

createConnection({
    type: 'mysql',
    host: database.MYSQL_HOSTNAME,
    port: parseInt(database.MYSQL_PORT),
    username: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    database: database.DATABASE,
    entities: [User, Slot, Detail],
    synchronize: true,
    logging: true,
})
    .then(async () => {
        /**
         * Error Handler. Provides full stack - remove for production
         */
        app.use(errorHandler());
        /**
         * Start Express server.
         */
        app.listen(app.get('port'), () => {
            console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
            console.log('  Press CTRL-C to stop\n');
        });
    })
    .catch(error => logger.error(error));

export default app;
