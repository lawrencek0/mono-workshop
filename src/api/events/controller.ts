import {
    JsonController,
    Post,
    Body,
    CurrentUser,
    Get,
    Param,
    Delete,
    UnauthorizedError,
    BodyParam,
    Patch,
} from 'routing-controllers';
import { User } from '../users/entity/User';
import { Event } from './entity/Event';
import { Inject } from 'typedi';
import { IEvent, EventList } from 'strongly-typed-events';
import { EventRepository, EventRosterRepository } from './repository';
import { UserRepository } from '../users/repository';
import { GroupEventRoster } from '../groups/entity/GroupEventRoster';
import { getRepository } from 'typeorm';
import { EventRoster } from './entity/EventRoster';
import { Role } from '../groups/entity/GroupUsers';

type EventUser = { role: Role; color: string } & User;
@JsonController('/events')
export class EventController {
    @Inject() private eventRepository: EventRepository;
    @Inject() private eventRosterRepository: EventRosterRepository;
    @Inject() private userRepository: UserRepository;
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
        @BodyParam('eventRoster') rawUsers: User[],
        @BodyParam('color') color: string,
    ) {
        const users = await this.userRepository.findAllByIds(rawUsers.map(({ id }) => id));

        const newEvent = await this.eventRepository.saveEvent({ ...event, owner });
        // Create a group event roster for each group for each user
        const roster = users.map(user => ({
            user,
            event: newEvent,
            color,
            role: 'member' as Role,
        }));

        await Promise.all([
            this.eventRosterRepository.saveEvents(roster),
            this.eventRosterRepository.saveEvent({ event: newEvent, color, user: owner, role: 'owner' }),
        ]);

        const eventForEmail: Event = await this.eventRepository.findOneWithEventRosterUsers(newEvent.id);
        this.dispatch('create', eventForEmail);

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

    @Patch('/:eventId')
    async update(
        @CurrentUser({ required: true }) user: User,
        @Param('eventId') eventId: number,
        @BodyParam('color') newColor: string,
        @BodyParam('title') newTitle: string,
        @BodyParam('description') newDesc: string,
        @BodyParam('eventRoster') users: User[],
    ) {
        const member = await this.eventRosterRepository.findByUserAndEvent(user.id, eventId);
        const membColor = member.color;

        if (member.role === 'member') {
            throw new UnauthorizedError('You cannot do this!');
        }

        const event = await this.eventRepository.findById(eventId);

        if (newTitle) event.title = newTitle;
        if (newDesc) event.description = newDesc;
        if (newColor) member.color = newColor;

        if (users) {
            const roster = users.map(user => ({
                user,
                event,
                color: newColor || membColor,
                role: 'member' as Role,
            }));

            await this.eventRosterRepository.saveEvents(roster);
        }

        await this.eventRepository.saveEvent(event);

        return this.eventRepository.findById(eventId);
    }

    @Patch('/:eventId/members/:memberId')
    async updateRole(
        @CurrentUser({ required: true }) user: User,
        @Param('eventId') eventId: number,
        @Param('memberId') memberId: number,
        @BodyParam('role') role: Role,
    ) {
        const targetUser = await this.eventRosterRepository.findByUserAndEvent(memberId, eventId);
        const currUser = await this.eventRosterRepository.findByUserAndEvent(user.id, eventId);
        const tar = await this.userRepository.findById(memberId);
        const event = await this.eventRepository.findById(eventId);

        if (targetUser && currUser) {
            if (
                currUser.role === 'member' ||
                (currUser.role === 'mod' && (role === 'owner' || targetUser.role === 'owner')) ||
                tar.id === user.id
            ) {
                // prevents users (mod or member) from changing a user to above their role
                throw new UnauthorizedError('You cannot do that');
            } else if (currUser.role === 'mod' && (targetUser.role === 'member' || targetUser.role === 'mod')) {
                // mods can add or remove mods
                targetUser.role = role;
                await this.eventRosterRepository.saveEvent({
                    role: role,
                    user: tar,
                    event: event,
                    color: targetUser.color,
                });
            } else if (currUser.role === 'owner') {
                // owners can edit roles freely
                targetUser.role = role;
                await this.eventRosterRepository.saveEvent({
                    role: role,
                    user: tar,
                    event,
                    color: targetUser.color,
                });
            }
            const { user: updatedUser, ...rest } = await this.eventRosterRepository.findByUserAndEvent(
                user.id,
                eventId,
            );
            return { ...updatedUser, ...rest };
        }
    }
    @Get('/')
    async findAll(@CurrentUser({ required: true }) user: User) {
        const events = await this.eventRepository.findAll(user.id);

        return events.map(event => {
            const eventUser = event.eventRoster.find(event => event && event.user && event.user.id === user.id);

            if (eventUser) {
                return {
                    ...event,
                    user: { ...eventUser.user, ...eventUser },
                };
            }
            return { ...event };
        });
    }

    @Get('/:eventId')
    async findOne(@CurrentUser({ required: true }) user: User, @Param('eventId') id: number) {
        const { eventRoster, ...event } = await this.eventRepository.findOne(id);
        const eventUser = eventRoster.find(event => event.user.id === user.id);

        if (!eventUser) {
            throw new UnauthorizedError("You shouldn't be here!");
        }

        return {
            ...event,
            user: { ...eventUser.user, ...eventUser },
            eventRoster: eventRoster.map(e => ({ ...e.user, color: e.color, role: e.role })),
        };
    }
}
