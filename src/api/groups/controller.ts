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

type UserWithPassword = User & { password: string };
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

    private dispatch(name: 'create' | 'delete', args: Group) {
        this.events.get(name).dispatchAsync(this, args);
    }
    // creates a group and populates the group_user table
    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @BodyParam('name') groupName: string,
        @BodyParam('members') users: User[],
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
                groupUsers: undefined,
                id: undefined,
                events: undefined,
                posts: undefined,
            });
            await Promise.all(
                users.map(async member => {
                    return this.groupUserRepo.saveGroupUser({
                        user: await this.userRepository.findByEmail(member.email),
                        group: newGroup,
                        role: 'member',
                    });
                }),
            );
            // this next line saves the creator as "owner" in the Group_users table
            await this.groupUserRepo.saveGroupUser({ user, group: newGroup, role: 'owner' });
            return { ...newGroup };
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

    // returns the list of members in a group
    @Get('/members/:groupId')
    async getGroupMembers(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        return this.groupRepo.getMembers(groupId);
    }

    // gets the desired group if the current user is a part of the group
    @Get('/:groupId')
    async getGroup(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const permission = await this.groupUserRepo.getThisMember(user.id, groupId);
        if (permission) {
            const group = await this.groupRepo.getGroup(groupId);
            const members = group.groupUsers.map(({ user, role }) => ({ ...user, role }));
            return { ...group, members, role: permission.role };
        } else {
            return 'You are not in this group';
        }
    }

    // allows updating the name of the group
    // also can add users to the group
    @Patch('/:groupId')
    async updateGroup(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('name') name: string,
        @BodyParam('members') users: User[],
    ) {
        const group = await this.groupRepo.getGroup(groupId);
        const groupUsers = await this.userRepository.findAllById(users.map(({ id }) => id));

        if (name) group.name = name;
        if (users) {
            await Promise.all(
                groupUsers.map(member => {
                    return this.groupUserRepo.saveGroupUser({ user: member, group: group, role: 'member' });
                }),
            );
        }
        return this.groupRepo.saveGroup(group);
    }

    // removes a user from the group
    // only the owner of the group and mods of the group can remove users
    @Delete('/user/:groupId')
    async removeUser(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('users') users: User,
    ) {
        const owner = await this.groupUserRepo.getThisMember(user.id, groupId);
        if (owner.role === 'owner' || owner.role === 'mod') {
            return this.groupUserRepo.removeUser(users.id, groupId);
        } else {
            return 'You do not have permission to do that';
        }
    }

    // deletes group if the current user is the owner
    @Delete('/:groupId')
    async deleteGroup(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        const owner = await this.groupUserRepo.getThisMember(user.id, groupId);

        if (owner && owner.role === 'owner') {
            return this.groupRepo.deleteGroup(groupId);
        } else {
            return 'You do not have permission to delete this group!';
        }
    }

    @Post('/:groupId/posts')
    async createPost(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('title') title: string,
        @BodyParam('contents') contents: string,
    ) {
        const group = await this.groupRepo.getGroup(groupId);

        return this.postRepo.savePost({ id: undefined, title: title, contents: contents, poster: user, group: group });
    }
}
