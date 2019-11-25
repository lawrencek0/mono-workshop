import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Event } from './entity/Event';
import { EventRoster } from './entity/EventRoster';
//import { User } from '../users/entity/User';

@Service()
export class EventRepository {
    @InjectRepository(Event)
    private repository: Repository<Event>;

    findAllStu(userId: number) {
        return this.repository.find({ where: { student: userId }, relations: ['event'] });
    }

    findById(id: number) {
        return this.repository.findOne({ where: { id }, relations: ['owner'] });
    }

    findByIds(ids: number[]) {
        return this.repository.findByIds(ids);
    }

    findAllByUser(userId: number) {
        return this.repository.find({ where: { owner: userId } });
    }

    findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }
    saveEvent(event: Event) {
        return this.repository.save(event);
    }
    deleteEvent(eventId: number) {
        return this.repository.delete(eventId);
    }
}

@Service()
export class EventRosterRepository {
    @InjectRepository(EventRoster)
    private repository: Repository<EventRoster>;
    saveColors(color: EventRoster[]) {
        return this.repository.save(color);
    }
    deleteByEvent(event: Event) {
        return this.repository.delete(event);
    }
    findById(id: number) {
        return this.repository.findOne({ where: { id }, relations: ['event'] });
    }
}
