import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Detail } from './entity/Detail';
import { Slot } from './entity/Slot';

@Service()
export class SlotRepository {
    @InjectRepository(Slot)
    private repository: Repository<Slot>;

    saveSlot(slot: Slot) {
        return this.repository.save(slot);
    }
}

@Service()
export class DetailRepository {
    @InjectRepository(Detail)
    private repository: Repository<Detail>;

    findById(id: number) {
        return this.repository.findOne(id);
    }

    saveDetail(detail: Detail) {
        return this.repository.save(detail);
    }
}
