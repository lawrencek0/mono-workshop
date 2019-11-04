import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from './entity/User';

@Service()
export class UserRepository {
    @InjectRepository(User)
    private repository: Repository<User>;

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

    saveUser(user: User) {
        return this.repository.save(user);
    }
}
