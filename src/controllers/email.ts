import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { email } from '../util/secrets';

AWS.config.update({
    accessKeyId: email.AWS_ACCESS_KEY_ID,
    secretAccessKey: email.AWS_SECRET_ACCESS_KEY,
    region: email.AWS_SES_REGION,
});

const transporter = nodemailer.createTransport({
    SES: new AWS.SES({ apiVersion: '2010-12-01' }),
});

// @TODO need to allow for 2+ attachment to be sent on a single email
export const sender = async (req: Request, res: Response) => {
    try {
        transporter.sendMail({
            from: email.SOURCE_EMAIL,
            to: req.body.receiver,
            subject: req.body.subj,
            text: req.body.text,
            alternatives: [
                {
                    filename: req.body.filename,
                    contentType: req.body.contentType,
                    content: req.body.content,
                },
            ],
        });
        res.send('Email successfully sent into the void');
    } catch (err) {
        res.send('Mistakes were made ' + err);
    }
};
