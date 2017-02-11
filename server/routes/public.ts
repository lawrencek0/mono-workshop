import { Router, Response, Request } from 'express';

const publicRouter: Router = Router();

publicRouter.get('/', (req: Request, res: Response) => {
  res.json({
    title: 'Greetings',
    text: 'Welcome to the Final Problem'
  });
});

export { publicRouter }
