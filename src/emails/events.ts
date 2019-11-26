import { Inject, Service } from 'typedi';
import { EmailService } from './service';
import { Event } from '../api/events/entity/Event';
@Service()
export class EventEmail {
    @Inject() private email: EmailService;

    public onCreate(event: Event) {
        const template = EmailService.getTemplate('events', 'create');
        event.eventRoster.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        owner: event.owner,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        location: event.location,
                        description: event.description,
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
    public onDelete(event: Event) {
        const template = EmailService.getTemplate('events', 'delete');

        event.eventRoster.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        owner: event.owner,
                        title: event.title,
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
