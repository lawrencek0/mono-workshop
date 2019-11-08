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
import { getRepository } from 'typeorm';
import { Inject } from 'typedi';
import { EventRepository, EventColorRepository } from './repository';
import { UserRepository } from '../users/repository';
import { GroupEventRoster } from '../groups/entity/GroupEventRoster';
import { GroupEventRepository, GroupRepository, GroupUsersRepository } from '../groups/repository';

@JsonController('/events')
export class EventController {
    @Inject() private eventRepository: EventRepository;
    @Inject() private eventColorRepository: EventColorRepository;
    @Inject() private userRepository: UserRepository;
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupEventsRepo: GroupEventRepository;
    @Inject() private groupUsersRepo: GroupUsersRepository;

    @Post('/')
    async create(
        @CurrentUser({ required: true }) owner: User,
        @Body() event: Event,
        @BodyParam('groupId') groupIds: number[],
    ) {
        try {
            // All users who are members of the group(s) sent in the request
            const users: User[] = await getRepository(User)
                .find({ relations: ['group.group', 'group'] })
                .then(users =>
                    users.filter(user =>
                        user.group.some(group => (group.group ? groupIds.includes(group.group.id) : false)),
                    ),
                );

            const newEvent: Event = await this.eventRepository.saveEvent({ ...event, owner });

            // Create a group event roster for each group for each user
            await Promise.all(
                users.map(user =>
                    user.group.map(group => {
                        const evnt = new GroupEventRoster();
                        evnt.group = group.group;
                        evnt.user = user;
                        evnt.event = newEvent;
                        evnt.going = false;
                        return this.groupEventsRepo.saveGroupEvent(evnt);
                    }),
                ),
            );
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
