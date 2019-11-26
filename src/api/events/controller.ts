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
    BodyParam,
} from 'routing-controllers';
import { User } from '../users/entity/User';
import { Event } from './entity/Event';
import { Inject } from 'typedi';
import { IEvent, EventList } from 'strongly-typed-events';
import { EventRepository, EventRosterRepository } from './repository';
import { UserRepository } from '../users/repository';
import { GroupEventRoster } from '../groups/entity/GroupEventRoster';
import { GroupEventRepository, GroupRepository, GroupUsersRepository } from '../groups/repository';
import { getRepository } from 'typeorm';
import { EventRoster } from './entity/EventRoster';

@JsonController('/events')
export class EventController {
    @Inject() private eventRepository: EventRepository;
    @Inject() private eventRosterRepository: EventRosterRepository;
    @Inject() private userRepository: UserRepository;
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupEventsRepo: GroupEventRepository;
    @Inject() private groupUsersRepo: GroupUsersRepository;
    private events = new EventList<this, Event>();

    get onCreate(): IEvent<this, Event> {
        return this.events.get('create').asEvent();
    }

    get onDelete(): IEvent<this, Event> {
        return this.events.get('delete').asEvent();
    }

    // private dispatch(name: 'create' | 'delete', args: Event) {
    //     this.events.get(name).dispatchAsync(this, args);
    // }
    private dispatch(name: 'create' | 'delete', args: Event) {
        this.events.get(name).dispatchAsync(this, args);
    }
    @Post('/')
    async create(
        @CurrentUser({ required: true }) owner: User,
        @Body() event: Event,
        @BodyParam('users') rawUsers: User[],
        @BodyParam('color') color: string,
    ) {
        const users = await this.userRepository.findAllByIds(rawUsers.map(({ id }) => id));

        const newEvent = await this.eventRepository.saveEvent({ ...event, owner });
        // Create a group event roster for each group for each user
        const roster = users.map(user => ({
            user,
            event: newEvent,
            color,
        }));

        await Promise.all([
            this.eventRosterRepository.saveEvents(roster),
            this.eventRosterRepository.saveEvent({ event: newEvent, color, user: owner }),
        ]);

        return this.eventRepository.findById(newEvent.id);
    }
    @Delete('/:eventId')
    async delete(@CurrentUser({ required: true }) user: User, @Param('eventId') id: number) {
        const event: Event = await getRepository(Event).findOne(id, {
            relations: [
                'groupEvent',
                'groupEvent.group',
                'groupEvent.event',
                'groupEvent.user',
                'owner',
                'eventRoster',
                'eventRoster.event',
                'eventRoster.user',
            ],
        });

        if (!event || user.id !== event.owner.id) {
            throw new UnauthorizedError('Unauthorized: You are not the Owner');
        } else {
            await getRepository(GroupEventRoster).remove(event.groupEvent);

            await getRepository(EventRoster).remove(event.eventRoster);
            this.dispatch('delete', { ...event });

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
