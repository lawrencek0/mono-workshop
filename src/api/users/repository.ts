import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, Role } from './entity/User';

@Service()
export class UserRepository {
    @InjectRepository(User)
    private repository: Repository<User>;

    findById(id: number) {
        return this.repository.findOne(id);
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
}
