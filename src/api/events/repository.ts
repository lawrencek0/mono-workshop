import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Event } from './entity/Event';
//import { User } from '../users/entity/User';

@Service()
export class EventRepository {
    @InjectRepository(Event)
    private repository: Repository<Event>;

    findAllStu(userId: number) {
        return this.repository.find({ where: { student: userId }, relations: ['event'] });
    }

    findById(id: number) {
        return this.repository.findOne({ where: { id: id } });
    }

    saveEvent(event: Event) {
        return this.repository.save(event);
    }
}
