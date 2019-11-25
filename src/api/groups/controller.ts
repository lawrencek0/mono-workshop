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

@JsonController('/groups')
export class GroupController {
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupUserRepo: GroupUsersRepository;
    @Inject() private groupEventRepo: GroupEventRepository;
    @Inject() private userRepository: UserRepository;
    @Inject() private postRepo: PostRepo;
    @Inject() private cognito: Cognito;
    private events = new EventList<this, Group>();

    get onCreate(): IEvent<this, Group> {
        return this.events.get('create').asEvent();
    }

    get onDelete(): IEvent<this, Group> {
        return this.events.get('delete').asEvent();
    }

    numAdder = (num1: number, num2: number) => num1 + num2;

    private dispatch(name: 'create' | 'delete', group: Group) {
        this.events.get(name).dispatchAsync(this, group);
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
                            return this.userRepository.saveUser(element).then(user => ({
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
        const groups = await this.groupUserRepo.getMyGroups(user.id);

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

    // allows updating the name of the group
    // also can add users to the group
    @Patch('/:groupId')
    async updateGroup(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('name') name?: string,
        @BodyParam('description') groupDescription?: string,
        @BodyParam('members') users?: User[],
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
        return this.groupRepo.saveGroup(group);
    }

    // returns the list of members in a group
    @Get('/:groupId/members')
    async getGroupMembers(@Param('groupId') groupId: number) {
        const groupUsers = await this.groupUserRepo.findAllByGroup(groupId);
        return groupUsers.map(groupUser => ({ ...groupUser.user, role: groupUser.role }));
    }

    // removes a user from the group
    // only the owner of the group and mods of the group can remove users
    @Delete(':groupId/members/:userId')
    async removeUser(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @Param('userId') userId: number,
    ) {
        const owner = await this.groupUserRepo.findByUserAndGroup(user.id, groupId);
        if (owner.role === 'owner' || owner.role === 'mod') {
            return this.groupUserRepo.removeUser(userId, groupId);
        } else {
            return 'You do not have permission to do that';
        }
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
}
