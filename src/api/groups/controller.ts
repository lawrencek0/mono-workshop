import {
    JsonController,
    Post,
    BodyParam,
    HttpError,
    CurrentUser,
    Get,
    Patch,
    Param,
    BadRequestError,
    Delete,
} from 'routing-controllers';
import { Inject } from 'typedi';
import { User } from '../users/entity/User';
import { GroupRepository, GroupUsersRepository, GroupEventRepository } from './repository';
import { UserRepository } from '../users/repository';
import G = require('glob');

@JsonController('/groups')
export class GroupController {
    @Inject() private groupRepo: GroupRepository;
    @Inject() private groupUserRepo: GroupUsersRepository;
    @Inject() private groupEventRepo: GroupEventRepository;
    @Inject() private userRepository: UserRepository;

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
                event: undefined,
            });
            await Promise.all(
                groupUsers.map(member => {
                    return this.groupUserRepo.saveGroupUser({ user: member, group: newGroup, role: 'member' });
                }),
            );
            // this next line saves the creator as "owner" in the Group_users table
            await this.groupUserRepo.saveGroupUser({ user, group: newGroup, role: 'owner' });
            return { newGroup };
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
    @Get('/:groupId')
    async getGroupMembers(@CurrentUser({ required: true }) user: User, @Param('groupId') groupId: number) {
        return this.groupRepo.getMembers(groupId);
    }

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

    @Delete('/user/:groupId')
    async removeUser(
        @CurrentUser({ required: true }) user: User,
        @Param('groupId') groupId: number,
        @BodyParam('users') users: User,
    ) {
        return this.groupUserRepo.removeUser(users.id, groupId);
    }
}
