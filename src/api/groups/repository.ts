import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GroupEventRoster } from './entity/GroupEventRoster';
import { GroupUser, Role } from './entity/GroupUsers';
import { Group } from './entity/Group';
import { User } from '../users/entity/User';
import { UserRepository } from '../users/repository';

@Service()
export class GroupRepository {
    @InjectRepository(Group)
    private repository: Repository<Group>;

    saveGroup(group: Group) {
        return this.repository.save(group);
    }

    getMembers(groupId: number) {
        return this.repository.find({ where: { id: groupId }, relations: ['groupUsers', 'groupUsers.user'] });
    }

    getGroup(groupId: number) {
        return this.repository.findOne({
            where: { id: groupId },
            relations: ['events', 'events.user', 'groupUsers', 'groupUsers.user'],
        });
    }

    deleteGroup(groupId: number) {
        return this.repository
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id: groupId })
            .execute();
    }
}

@Service()
export class GroupEventRepository {
    @InjectRepository(GroupEventRoster)
    private repository: Repository<GroupEventRoster>;

    saveGroupEvent(groupEvent: GroupEventRoster) {
        return this.repository.save(groupEvent);
    }
}

@Service()
export class GroupUsersRepository {
    @InjectRepository(GroupUser)
    private userRepository: UserRepository;

    private repository: Repository<GroupUser>;

    saveGroupUser(groupUser: GroupUser) {
        return this.repository.save(groupUser);
    }

    getMyGroups(userId: number) {
        return this.repository.find({ where: { user: userId }, relations: ['group'] });
    }

    removeUser(userId: number, groupId: number) {
        return (
            this.repository
                .createQueryBuilder()
                .delete()
                // .from(DetailUsersRepo)
                .where('user.id = :userId AND group.id = :groupId', { userId: userId, groupId: groupId })
                .execute()
        );
    }

    getThisMember(userId: number, groupId: number) {
        return this.repository.findOne({ where: { user: userId, group: groupId } });
    }

    getMembers(groupId: number) {
        return this.repository.find({ where: { id: groupId }, relations: ['user'] });
    }

    // Saves all users from users array into a group
    // All users will be given the same role that's passed in
    async addMembers(users: User[], group: Group, role: Role) {
        await Promise.all(
            users.map(async member => {
                return this.saveGroupUser({
                    user: await this.userRepository.findByEmail(member.email),
                    group,
                    role,
                });
            }),
        );
    }
}
