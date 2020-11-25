import compression from 'compression';
import express from 'express';
import path from 'path';

import * as apiController from './controllers/api';
import * as homeController from './controllers/home';

const app = express();

app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', homeController.index);
app.get('/api/', apiController.index);

export default app;
