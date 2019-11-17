import { Inject, Service } from 'typedi';
import { EmailService } from './service';
import { Detail } from '../api/appointments/entity/Detail';

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
                    },
                    locals: {
                        name: detail.users[0].user.firstName,
                        faculty: detail.faculty,
                        title: detail.title,
                    },
                },
                {
                    // uncomment: to view emails locally
                    // preview: {
                    //     open: {
                    //         app: 'firefox',
                    //         wait: true,
                    //     },
                    // },
                    send: true,
                },
            );
        });
    }
}
