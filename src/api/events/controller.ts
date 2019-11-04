import {
    JsonController,
    Post,
    Body,
    HttpError,
    CurrentUser,
    Get,
    Param,
    Delete,
    Put,
    UnauthorizedError,
} from 'routing-controllers';
import { User } from '../users/entity/User';
import { EventColor } from '../events/entity/Color';
import { Event } from './entity/Event';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Inject } from 'typedi';
import { EventRepository, EventColorRepository } from './repository';
import { UserRepository } from '../users/repository';

@JsonController('/events')
export class EventController {
    @Inject() private eventRepository: EventRepository;
    @Inject() private eventColorRepository: EventColorRepository;
    @Inject() private userRepository: UserRepository;
    // @InjectRepository(Event)
    // @InjectRepository(User)
    // @InjectRepository(EventColor)
    // eventRepository2: Repository<Event>;
    // userRepository2: Repository<User>;
    // eventColorRepository2: Repository<EventColor>;

    @Post('/')
    async create(@CurrentUser({ required: true }) owner: User, @Body() event: Event) {
        try {
            const users = await this.userRepository.findAllByIds(event.users.map(({ id }) => id));
            const newEvent: Event = await this.eventRepository.saveEvent({ ...event, owner, users });

            const eventColors = users.map(user => {
                const evnt = new EventColor();
                evnt.color = event.color;
                evnt.user = user;
                evnt.event = newEvent;
                return evnt;

                // {color: "UPDATED COLOR", user: {id: '', blah}, event: {}}
            });

            // [color, user, eventid]
            await this.eventColorRepository.saveColors(eventColors);
            return newEvent;
        } catch (e) {
            throw new HttpError(e);
        }
    }
    @Delete('/:eventId')
    async delete(@CurrentUser({ required: true }) user: User, @Param('eventId') id: number) {
        const event: Event = await this.eventRepository.findById(id);
        if (!event || user.id !== event.owner.id) {
            throw new UnauthorizedError('Unauthorized: You are not the Owner');
        } else {
            await this.eventColorRepository.deleteByEvent(event);
            return this.eventRepository.deleteEvent(event.id);
        }
    }

    @Put('/:id')
    async update(@CurrentUser({ required: true }) user: User, @Body() event: Event, @Param('id') id: number) {
        try {
            const currentEvent: Event = await this.eventRepository.findById(id);
            if (user.id !== currentEvent.owner.id) {
                return 'Unauthorized: You are not the Owner';
            }

            const newEvent = { ...currentEvent, ...event };
            if (event.users) newEvent.users = await this.userRepository.findAllByIds(event.users.map(({ id }) => id));

            return this.eventRepository.saveEvent(event);
        } catch (e) {
            throw new HttpError(e);
        }
    }
    @Get('/')
    async findAll(@CurrentUser({ required: true }) user: User) {
        try {
            const Events: Event[] = await this.eventRepository.findAll(user.id);

            return { Events };
        } catch (e) {
            throw new HttpError(e);
        }
    }
    @Get('/:eventId')
    async findOne(@CurrentUser({ required: true }) user: User, @Param('eventId') id: number) {
        try {
            const Event: Event = await this.eventRepository.findOne(id);
            return { Event };
        } catch (e) {
            throw new HttpError(e);
        }
    }
}
