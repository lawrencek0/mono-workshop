import app from './app';
import databaseConn from './database';
import logger from './util/logger';

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
    });
});

export default app;
