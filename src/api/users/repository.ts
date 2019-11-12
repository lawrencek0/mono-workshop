import { Service } from 'typedi';
import { User, Role } from './entity/User';
import { Repository, Connection } from 'typeorm';
import { InjectRepository, InjectConnection } from 'typeorm-typedi-extensions';

@Service()
export class UserRepository {
    @InjectRepository(User)
    private repository: Repository<User>;
    @InjectConnection()
    private connection: Connection;

    findById(id: number) {
        return this.repository.findOne(id);
    }

    findAllByIds(ids: number[]) {
        return this.repository.findByIds(ids);
    }

    findByEmail(email: string) {
        return this.repository.findOne({ email });
    }

    findAllById(userIds: number[]) {
        return this.repository.findByIds(userIds);
    }

    findAllByRole(role: Role) {
        return this.repository.find({ role });
    }

    saveUser(user: User) {
        return this.repository.save(user);
    }
    saveUsers(users: User[]) {
        return this.repository.save(users);
    }
    userGroup(groupIds: number[]) {
        return this.repository
            .find({ relations: ['group.group', 'group'] })
            .then(users =>
                users.filter(user =>
                    user.group.some(group => (group.group ? groupIds.includes(group.group.id) : false)),
                ),
            );
    }
}
