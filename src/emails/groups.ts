import { Inject, Service } from 'typedi';
import { EmailService } from './service';
import { Group } from '../api/groups/entity/Group';
import { User } from '../api/users/entity/User';

@Service()
export class GroupEmail {
    @Inject() private email: EmailService;

    public onCreate(group: Group) {
        const template = EmailService.getTemplate('group', 'create');
        const owner: User = group.groupUsers.find(groupUser => groupUser.role === 'owner').user;
        group.groupUsers.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        owner: owner,
                        title: group.name,
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
    public onDelete(group: Group) {
        const template = EmailService.getTemplate('group', 'delete');
        // let owner: any;
        const owner: User = group.groupUsers.find(groupUser => groupUser.role === 'owner').user;

        group.groupUsers.map(user => {
            this.email.sendEmail(
                {
                    template,
                    message: {
                        //to: user.user.email,
                        to: 'sujeong0826@gmail.com',
                    },
                    locals: {
                        name: user.user.firstName,
                        owner: owner,
                        title: group.name,
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
