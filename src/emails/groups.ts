import { Inject, Service } from 'typedi';
import { EmailService } from './service';
import { Group } from '../api/groups/entity/Group';
import moment from 'moment';

@Service()
export class GroupEmail {
    @Inject() private email: EmailService;

    public onCreate(group: Group) {
        const template = EmailService.getTemplate('group', 'create');

        group.users.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        faculty: group.faculty,
                        title: group.title,
                        slots: group.slots.map(slot => ({
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
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
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
