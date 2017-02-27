import { Router, Request, Response } from 'express';

const contactRouter: Router = Router();

contactRouter.post('/', (req: Request, res: Response) => {
  res.json({
    'message': 'Got yo data',
    'res': req.body
  })
});

export { contactRouter }
