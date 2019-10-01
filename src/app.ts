import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
// import router from './router';
import 'reflect-metadata';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 8000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes will be behind /api
 */
// app.use('/api', router);

export default app;
