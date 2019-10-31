import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Event } from './entity/Event';
import { EventColor } from './entity/Color';
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
    saveEvent(event: Event) {
        return this.repository.save(event);
    }
    deleteEvent(eventId: number) {
        return this.repository.delete(eventId);
    }
}

@Service()
export class EventColorRepository {
    @InjectRepository(EventColor)
    private repository: Repository<EventColor>;
    saveColors(color: EventColor[]) {
        return this.repository.save(color);
    }
    deleteByEvent(event: Event) {
        return this.repository.delete(event);
    }
    findById(id: number) {
        return this.repository.findOne({ where: { id }, relations: ['event'] });
    }
}
