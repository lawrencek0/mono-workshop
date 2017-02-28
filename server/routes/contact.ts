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
    to: 'lawrence_2009@hotmail.com',
    subject: req.body.name,
    text: req.body.message,
    html: `<b>${req.body.message}</b>`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

export { contactRouter }
