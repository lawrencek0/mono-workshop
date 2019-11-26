import { Inject, Service } from 'typedi';
import { EmailService } from './service';
import { Detail } from '../api/appointments/entity/Detail';
import { Slot } from '../api/appointments/entity/Slot';
import { getMaxListeners } from 'cluster';
import moment from 'moment';

@Service()
export class AppointmentEmail {
    @Inject() private email: EmailService;

    public onCreate(detail: Detail) {
        const template = EmailService.getTemplate('appointments', 'create');

        detail.users.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        to: user.user.email,
                        //to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        faculty: detail.faculty,
                        title: detail.title,
                        slots: detail.slots.map(slot => ({
                            start: moment(slot.start).format('LLL'),
                            end: moment(slot.end).format('LLL'),
                        })),
                    },
                },
                {
                    // set preview to true to open email in browser
                    preview: true,
                    // set send to true to send email even if in development/test
                    send: false,
                    juiceResources: {
                        webResources: {
                            relativeTo: template,
                        },
                    },
                },
            );
        });
    }
    public onDelete(detail: Detail) {
        const template = EmailService.getTemplate('appointments', 'delete');
        console.dir(detail);
        detail.users.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        to: user.user.email,
                        //to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        faculty: detail.faculty,
                        title: detail.title,
                    },
                },
                {
                    // set preview to true to open email in browser
                    preview: true,
                    // set send to true to send email even if in development/test
                    send: false,
                    juiceResources: {
                        webResources: {
                            relativeTo: template,
                        },
                    },
                },
            );
        });
    }
}
