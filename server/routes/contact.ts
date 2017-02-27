import { Router, Response, Request } from 'express';

const contactRouter: Router = Router();

contactRouter.get('/', (req,res) => {
  res.json({
    title: 'Hi',
    text: 'Thanks for contacting!'
  });
});

export { contactRouter }
