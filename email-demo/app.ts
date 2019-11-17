// import AWS from 'aws-sdk';
import emailTemplate from 'email-templates';
// import { email } from '../src/util/secrets';
// import nodemailer from 'nodemailer';

// AWS.config.update({
//     accessKeyId: email.AWS_ACCESS_KEY_ID,
//     secretAccessKey: email.AWS_SECRET_ACCESS_KEY,
//     region: email.AWS_SES_REGION,
// });

// const transport = nodemailer.createTransport({
//     SES: new AWS.SES({ apiVersion: '2010-12-01' }),
// });

const template = new emailTemplate({
    message: {
        from: 'niftylettuce@gmail.com',
    },
    // uncomment below to send emails in development/test env:
    // send: true
    // transport,
    transport: { jsonTransport: true },
    views: { root: __dirname },
});

template
    .send({
        template: 'create-group',
        message: {
            to: 'sujeong0826@gmail.com',
        },
        locals: {
            name: 'Sujeong',
            faculty: 'Jang',
            appointmentTitle: 'freshman appointment',
        },
    })
    .then(console.log)
    .catch(console.error);
