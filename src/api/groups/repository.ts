import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GroupEventRoster } from './entity/GroupEventRoster';
import { GroupUser } from './entity/GroupUsers';
import { Group } from './entity/Group';
import { User } from '../users/entity/User';

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
    private repository: Repository<GroupUser>;

    saveGroupUser(groupUser: GroupUser) {
        return this.repository.save(groupUser);
    }

    getMyGroups(userId: number) {
        return this.repository.find({ where: { user: userId }, relations: ['group'] });
    }
}
