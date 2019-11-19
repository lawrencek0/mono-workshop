import AWS from 'aws-sdk';
import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import * as path from 'path';
import { email } from '../util/secrets';
import { Service } from 'typedi';

AWS.config.update({
    accessKeyId: email.AWS_ACCESS_KEY_ID,
    secretAccessKey: email.AWS_SECRET_ACCESS_KEY,
    region: email.AWS_SES_REGION,
});

@Service()
export class EmailService {
    private transport = nodemailer.createTransport({
        SES: new AWS.SES({ apiVersion: '2010-12-01' }),
    });

    public async sendEmail(
        send: Parameters<EmailTemplate['send']>[0],
        config?: Partial<ConstructorParameters<typeof EmailTemplate>[0]>,
    ): Promise<void> {
        const template = new EmailTemplate({
            message: {
                from: 'ses4teamyellow@gmail.com',
            },
            // uncomment below to send emails in development/test env:
            // send: true
            transport: this.transport,
            views: {
                root: __dirname,
            },
            ...config,
        });

        try {
            await template.send({
                ...send,
            });
        } catch (e) {
            // @TODO: maybe log to database for admin to view errors?
            console.error(e);
        }
    }

    public static getTemplate(feature: string, type: string) {
        return path.resolve(process.cwd(), 'email-templates', feature, type);
    }
}
