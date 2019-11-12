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
import { GroupRepository, GroupUsersRepository, GroupEventRepository } from './repository';
import { UserRepository } from '../users/repository';
import Cognito from '../auth/cognito';
import { Group } from './entity/Group';

type UserWithPassword = User & { password: string };
@JsonController('/groups')
export class GroupController {
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupUserRepo: GroupUsersRepository;
    @Inject() private groupEventRepo: GroupEventRepository;
    @Inject() private userRepository: UserRepository;
    @Inject() private cognito: Cognito;
    // creates a group and populates the group_user table
    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @BodyParam('name') groupName: string,
        @BodyParam('users') users: User[],
    ) {
        try {
            const groupUsers = await this.userRepository.findAllById(users.map(({ id }) => id));

            const newGroup = await this.groupRepo.saveGroup({
                name: groupName,
                groupUsers: undefined,
                id: undefined,
                events: undefined,
            });
            await Promise.all(
                groupUsers.map(member => {
                    return this.groupUserRepo.saveGroupUser({ user: member, group: newGroup, role: 'member' });
                }),
            );
            // this next line saves the creator as "owner" in the Group_users table
            await this.groupUserRepo.saveGroupUser({ user, group: newGroup, role: 'owner' });
            return { ...newGroup };
        } catch (error) {
            throw new HttpError(error);
        }
    }
    @Post('/fileUpload')
    async bulkCreate(
        @CurrentUser({ required: true }) user: User,
        @BodyParam('name') groupName: string,
        @BodyParam('users') users: UserWithPassword[],
    ) {
        try {
            // Save new users in local database
            const newStudents = await this.userRepository.saveNewUsers(users);

            // Save new users in incognito
            this.userRepository.saveUsersInIncognito(newStudents, this.cognito);

            // Create new group to put all users from request in
            const newGroup: Group = await this.groupRepo.saveGroup({
                name: groupName,
                groupUsers: undefined,
                id: undefined,
                events: undefined,
            });

            // Add each user as a member to the group
            this.groupUserRepo.addMembers(users, newGroup, 'member');

            // Save the creator as "owner" in the Group_users table
            await this.groupUserRepo.saveGroupUser({ user, group: newGroup, role: 'owner' });

            return { ...newGroup };
        } catch (error) {
            throw new HttpError(error);
        }
    }
    // returns the groups that the current user is a part of
    @Get('/')
    async getMyGroups(@CurrentUser({ required: true }) user: User) {
        return this.groupUserRepo.getMyGroups(user.id);
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
            return this.groupRepo.getGroup(groupId);
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
        @BodyParam('users') users: User[],
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
}
