import { Router, Request, Response } from 'express';
import * as nodemailer from 'nodemailer';

import * as config from './config';

const contactRouter: Router = Router();

let transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
      user: config.mailUser,
      pass: config.mailPass
  }
});

contactRouter.post('/', (req: Request, res: Response) => {
  let mailOptions = {
    from: req.body.email,
    to: 'lawatlifecompany@gmail.com',
    subject: req.body.name,
    text: req.body.message
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
  });
});

export { contactRouter }
