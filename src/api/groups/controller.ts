import {
    JsonController,
    Post,
    BodyParam,
    HttpError,
    CurrentUser,
    Get,
    Patch,
    Param,
    Delete,
    UnauthorizedError,
    Body,
} from 'routing-controllers';
import { Inject } from 'typedi';
import { User } from '../users/entity/User';
import { GroupRepository, GroupUsersRepository, GroupEventRepository, PostRepo } from './repository';
import { UserRepository } from '../users/repository';
import hashids from '../../util/hasher';
import { IEvent, EventList } from 'strongly-typed-events';
import Cognito from '../auth/cognito';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Group } from './entity/Group';
import { Role } from './entity/GroupUsers';
import { Event } from '../events/entity/Event';
import { EventRepository } from '../events/repository';
import { GroupEventRoster } from './entity/GroupEventRoster';

@JsonController('/groups')
export class GroupController {
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupUserRepo: GroupUsersRepository;
    @Inject() private groupEventRepo: GroupEventRepository;
    @Inject() private userRepository: UserRepository;
    @Inject() private eventRepository: EventRepository;
    @Inject() private postRepo: PostRepo;
    @Inject() private cognito: Cognito;
    private events = new EventList<this, Group>();

    get onCreate(): IEvent<this, Group> {
        return this.events.get('create').asEvent();
    }

    get onDelete(): IEvent<this, Group> {
        return this.events.get('delete').asEvent();
    }

    private dispatch(name: 'create' | 'delete', group: Group) {
        this.events.get(name).dispatchAsync(this, group);
    }

    private eventEvents = new EventList<this, Event>();
    get onCreateEvent(): IEvent<this, Event> {
        return this.eventEvents.get('create').asEvent();
    }

    get onDeleteEvent(): IEvent<this, Event> {
        return this.eventEvents.get('delete').asEvent();
    }

    private dispatchEvent(name: 'create' | 'delete', roster: Event) {
        this.eventEvents.get(name).dispatchAsync(this, roster);
    }

    // creates a group and populates the group_user table
    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @BodyParam('name') groupName: string,
        @BodyParam('description') groupDescription: string,
        @BodyParam('groupUsers') users: User[],
    ) {
        try {
            const students = await Promise.all(
                users.map(async element => {
                    return this.userRepository.findByEmail(element.email).then(existUser => {
                        if (!existUser) {
                            const role = /^[A-Z0-9]+(@warhawks.ulm.edu)$/i.test(element.email) ? 'student' : 'faculty';
                            return this.userRepository.saveUser({ ...element, role }).then(user => ({
                                ...user,
                                password: '$uperStr0ng',
                            }));
                        }
                        return null;
                    });
                }),
            );
            const newStudents = students.filter(student => student);
            await Promise.all(
                newStudents.map(async element => {
                    const id = element.id;
                    const hashedId = hashids.encode(id);
                    const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
                        new AmazonCognitoIdentity.CognitoUserAttribute({
                            Name: 'email',
                            Value: element.email,
                        }),
                        new AmazonCognitoIdentity.CognitoUserAttribute({
                            Name: 'custom:user_id',
                            Value: hashedId,
                        }),
                    ];

                    return new Promise((resolve, reject) =>
                        this.cognito.userPool.signUp(
                            element.email,
                            element.password,
                            attributeList,
                            null,
                            (err, _result) => {
                                if (err) {
                                    // @FIXME: what if it fails here? need a way to undo the query
                                    return reject(new HttpError(409, err.message));
                                }

                                return resolve({ id: hashedId, element });
                            },
                        ),
                    );
                }),
            );
            const newGroup = await this.groupRepo.saveGroup({
                name: groupName,
                description: groupDescription,
                groupUsers: undefined,
                id: undefined,
                events: undefined,
                posts: undefined,
            });

            const newMembers = new Set<string>();

            await Promise.all(
                users.map(async member => {
                    if (newMembers.has(member.email)) {
                        return [];
                    }
                    newMembers.add(member.email);
                    return this.groupUserRepo.saveGroupUser({
                        user: await this.userRepository.findByEmail(member.email),
                        group: newGroup,
                        role: 'member',
                    });
                }),
            );
            // this next line saves the creator as "owner" in the Group_users table
            await this.groupUserRepo.saveGroupUser({ user, group: newGroup, role: 'owner' });
            const [group, members] = await Promise.all([
                this.groupRepo.findById(newGroup.id),
                this.groupUserRepo.findAllByGroup(newGroup.id),
            ]);

            const allGroupInfo = { ...group, groupUsers: members };

            this.dispatch('create', allGroupInfo);

            return allGroupInfo;
        } catch (error) {
            throw new HttpError(error);
        }
    }
    // returns the groups that the current user is a part of
    @Get('/')
    async getMyGroups(@CurrentUser({ required: true }) user: User) {
        const groups = await this.groupUserRepo.findAllByUser(user.id);

        return groups.map(({ group, ...rest }) => ({ ...group, ...rest }));
    }

    // gets the desired group if the current user is a part of the group
    @Get('/:groupId')
    async getGroup(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const [groupUser, group] = await Promise.all([
            this.groupUserRepo.findByUserAndGroup(user.id, groupId),
            this.groupRepo.findById(groupId),
        ]);
        return { ...group, user: groupUser ? { ...groupUser.user, role: groupUser.role } : undefined };
    }

    @Patch('/:groupId/members/:userId')
    async updateUserRole(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @Param('userId') userId: number,
        @BodyParam('role') role: Role,
    ) {
        const targetUser = await this.groupUserRepo.findByUserAndGroup(userId, groupId);
        const currUser = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);
        const tar = await this.userRepository.findById(userId);
        const group = await this.groupRepo.findById(groupId);

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
                await this.groupUserRepo.saveGroupUser({ role: role, user: tar, group: group });
            } else if (currUser.role === 'owner') {
                // owners can edit roles freely
                targetUser.role = role;
                const { user, role: newRole } = await this.groupUserRepo.saveGroupUser({
                    role: role,
                    user: tar,
                    group: group,
                });
                return { ...user, role: newRole };
            }
            return this.groupUserRepo.findByUserAndGroup(userId, groupId);
        }

        throw new UnauthorizedError('You or the target is not part of this group');
    }

    // allows updating the name of the group
    // also can add users to the group
    @Patch('/:groupId')
    async updateGroup(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('name') name?: string,
        @BodyParam('description') groupDescription?: string,
        @BodyParam('groupUsers') users?: User[],
    ) {
        const [group, groupUser] = await Promise.all([
            this.groupRepo.findById(groupId),
            this.groupUserRepo.findByUserAndGroup(user.id, groupId),
        ]);

        if (groupUser.role === 'member') {
            throw new UnauthorizedError('You are only a member!');
        }

        if (name) group.name = name;
        if (groupDescription) group.description = groupDescription;

        if (users) {
            const groupUsers = await this.userRepository.findAllByIds(users.map(({ id }) => id));

            await Promise.all(
                groupUsers.map(member => {
                    return this.groupUserRepo.saveGroupUser({ user: member, group: group, role: 'member' });
                }),
            );
        }
        await this.groupRepo.saveGroup(group);
        const [updatedGroup, members] = await Promise.all([
            this.groupRepo.findById(group.id),
            this.groupUserRepo.findAllByGroup(group.id),
        ]);

        return { ...updatedGroup, groupUsers: members.map(({ role, user }) => ({ role, ...user })) };
    }

    // returns the list of members in a group
    @Get('/:groupId/members')
    async getGroupMembers(@Param('groupId') groupId: number) {
        const groupUsers = await this.groupUserRepo.findAllByGroup(groupId);
        return groupUsers.map(groupUser => ({ ...groupUser.user, role: groupUser.role }));
    }

    // removes a user from the group
    // only the owner of the group and mods of the group can remove users
    @Delete('/:groupId/members/:userId')
    async removeUser(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @Param('userId') userId: number,
    ) {
        const owner = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);
        if (owner.role === 'owner' || owner.role === 'mod') {
            return this.groupUserRepo.removeUser(userId, groupId);
        }
        throw new UnauthorizedError('You do not have permission to do that');
    }

    // deletes group if the current user is the owner
    @Delete('/:groupId')
    async deleteGroup(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const owner = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);

        if (owner && owner.role === 'owner') {
            const emailGroup = await this.groupRepo.findById(groupId);
            this.dispatch('delete', { ...emailGroup });
            return this.groupRepo.deleteGroup(groupId);
        } else {
            return 'You do not have permission to delete this group!';
        }
    }

    @Get('/:groupId/posts')
    async getPosts(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const isInGroup = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);

        if (!isInGroup) {
            throw new UnauthorizedError("You aren't in this group");
        }

        return this.postRepo.findAllByGroup(groupId);
    }

    @Post('/:groupId/posts')
    async createPost(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('title') title: string,
        @BodyParam('contents') contents: string,
    ) {
        const group = await this.groupRepo.findById(groupId);

        return this.postRepo.savePost({ id: undefined, title: title, contents: contents, poster: user, group: group });
    }

    @Get('/:groupId/events')
    async getEvents(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const roster = await this.groupEventRepo.findAllByGroup(groupId);
        const eventIds = roster.reduce((unique, { event }) => {
            if (unique.has(event.id)) {
                return unique;
            }
            unique.add(event.id);
            return unique;
        }, new Set<number>());

        return this.eventRepository.findByIds(Array.from(eventIds.values()));
    }

    @Get('/events/all')
    async getAllEvents(@CurrentUser({ required: true }) user: User) {
        const events = await this.groupEventRepo.findAllByUser(user.id);
        return events.map(event => ({ going: event.going, group: event.group, ...event.event }));
    }

    @Get('/:groupId/events/:eventId')
    async getEvent(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @Param('eventId') eventId: number,
    ) {
        const [{ event, ...rest }, members] = await Promise.all([
            this.groupEventRepo.findOne(user.id, groupId, eventId),
            this.groupEventRepo.findAllByGroupAndEvent(groupId, eventId),
        ]);

        return { ...event, ...rest, members };
    }

    @Post('/:groupId/events')
    async createEvent(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @Body() event: Event,
    ) {
        const owner = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);

        if (owner.role === 'member') {
            throw new UnauthorizedError("You don't have permissions to create an event");
        }

        console.dir(owner);
        const [newEvent, group, members] = await Promise.all([
            this.eventRepository.saveEvent({ ...event, owner: user }),
            this.groupRepo.findById(groupId),
            this.groupUserRepo.findAllByGroup(groupId),
        ]);
        console.log('hmmm');

        console.dir(newEvent, group, members);

        const groupEvents: GroupEventRoster[] = members.map(member => ({
            event: newEvent,
            user: member.user,
            group,
            going: false,
        }));

        await this.groupEventRepo.saveGroupEvents(groupEvents);

        const emailEvent: Event = await this.eventRepository.findOneWithGroupEvent(newEvent.id);

        this.dispatchEvent('create', emailEvent);

        return this.eventRepository.findById(newEvent.id);
    }
}
