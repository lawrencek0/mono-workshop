import { JsonController, Post, Body, HttpError, CurrentUser } from 'routing-controllers';
import { User } from '../users/entity/User';
import { EventColor } from '../events/entity/Color';
import { Event } from './entity/Event';
import { Repository, getRepository } from 'typeorm';

@JsonController('/events')
export class EventController {
    private eventRepository: Repository<Event> = getRepository(Event);
    private eventColorRepository: Repository<EventColor> = getRepository(EventColor);
    private userRepository: Repository<User> = getRepository(User);

    @Post('/')
    async create(@CurrentUser({ required: true }) creator: User, @Body() body: any) {
        try {
            const users: User[] = await this.userRepository.findByIds(body.users.map(({ id }: { id: number }) => id));
            const event = await this.eventRepository.save({
                title: body.title,
                start: body.start,
                end: body.end,
                description: body.description,
                location: body.location,
                owner: creator,
                users,
            });

            const events = await Promise.all(
                users.map(user => {
                    const evnt = new EventColor();
                    evnt.color = body.color;
                    evnt.user = user;
                    evnt.event = event;
                    return evnt;
                }),
            );
            await this.eventColorRepository.insert(events);
            return event;
        } catch (e) {
            throw new HttpError(e);
        }
    }
}
