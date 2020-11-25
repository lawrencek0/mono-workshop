import app from './app';
import databaseConn from './database';
import logger from './util/logger';
import Container from 'typedi';
import { EmailOrchestrator } from './emails/orchestrator';

/**
 * Start Express server.
 */
databaseConn().then(() => {
    /**
     * Start Express server.
     */
    app.listen(app.get('port'), () => {
        logger.info('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
        logger.info('  Press CTRL-C to stop\n');
        logger.info('Registering services');
        logger.info('\tRegistering email services...');
        const email = Container.get(EmailOrchestrator);
        email.registerEvents();
        logger.info('\tRegistered email services');
    });
});

export default app;
