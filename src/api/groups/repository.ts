import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GroupEventRoster } from './entity/GroupEventRoster';
import { GroupUser } from './entity/GroupUsers';
import { Group } from './entity/Group';
import { GroupPost } from './entity/GroupPost';

@Service()
export class GroupRepository {
    @InjectRepository(Group)
    private repository: Repository<Group>;

    saveGroup(group: Group) {
        return this.repository.save(group);
    }

    findAll() {
        return this.repository.find();
    }

    findById(groupId: number) {
        return this.repository.findOne({
            where: { id: groupId },
        });
    }

    findAllEventsById(groupId: number) {
        return this.repository.find({
            where: { id: groupId },
            relations: ['events', 'events.event'],
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

    saveGroupEvents(groupEvents: GroupEventRoster[]) {
        return this.repository.save(groupEvents);
    }

    findOne(userId: number, groupId: number, eventId: number) {
        return this.repository.findOne({
            where: { user: userId, group: groupId, event: eventId },
            relations: ['event'],
        });
    }

    findAllByGroupAndEvent(groupId: number, eventId: number) {
        return this.repository.find({ where: { group: groupId, event: eventId }, relations: ['user'] });
    }

    findAllByUser(userId: number) {
        return this.repository.find({ where: { user: userId }, relations: ['event', 'group'] });
    }

    findAllByGroup(groupId: number) {
        return this.repository
            .createQueryBuilder('roster')
            .where('roster.group = :groupId', { groupId })
            .distinct()
            .innerJoinAndSelect('roster.event', 'event')
            .getMany();
    }
}

@Service()
export class GroupUsersRepository {
    @InjectRepository(GroupUser)
    private repository: Repository<GroupUser>;

    saveGroupUser(groupUser: GroupUser) {
        return this.repository.save(groupUser);
    }

    findAllByUser(userId: number) {
        return this.repository
            .createQueryBuilder('groupUser')
            .where('groupUser.user = :user', { user: userId })
            .leftJoinAndSelect('groupUser.group', 'group')
            .leftJoin('group.posts', 'post')
            .orderBy({
                'post.id': 'DESC',
            })
            .getMany();
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

    findByUserAndGroup(userId: number, groupId: number) {
        return this.repository.findOne({ where: { user: userId, group: groupId }, relations: ['user'] });
    }

    findAllByGroup(groupId: number) {
        return this.repository.find({ where: { group: groupId }, relations: ['user'] });
    }
}

@Service()
export class PostRepo {
    @InjectRepository(GroupPost)
    private repository: Repository<GroupPost>;

    findAllByGroup(groupId: number) {
        return this.repository.find({ where: { group: groupId }, relations: ['poster'], order: { id: 'DESC' } });
    }

    savePost(post: GroupPost) {
        return this.repository.save(post);
    }
}
