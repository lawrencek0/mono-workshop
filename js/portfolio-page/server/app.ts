import * as express from 'express';
import * as path from 'path';
import { json, urlencoded } from  'body-parser';
import * as compression from 'compression';

import { publicRouter } from './routes/public';
import { contactRouter } from "./routes/contact";

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// routes
app.use('/api', publicRouter);
app.use('/api/contact', contactRouter);

if (app.get('env') === 'production') {
  app.use(express.static(path.join(__dirname, '/../client')));
}

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  let err = new Error('Not Found');
  next(err);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export { app }
