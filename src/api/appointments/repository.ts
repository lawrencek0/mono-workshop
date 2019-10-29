import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Detail } from './entity/Detail';
import { Slot } from './entity/Slot';
//import { User } from '../users/entity/User';

@Service()
export class SlotRepository {
    @InjectRepository(Slot)
    private repository: Repository<Slot>;

    findAllStu(userId: number) {
        return this.repository.find({ where: { student: userId }, relations: ['detail'] });
    }

    findById(slotId: number) {
        return this.repository.findOne({ where: { id: slotId } });
    }

    findByDetail(detailId: number) {
        return this.repository.find({ where: { detail: detailId } });
    }

    saveSlot(slot: Slot) {
        return this.repository.save(slot);
    }
}

@Service()
export class DetailRepository {
    @InjectRepository(Detail)
    private repository: Repository<Detail>;

    findAllStu(userId: number) {
        return this.repository
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId', { studentId: userId })
            .innerJoinAndSelect('detail.slots', 'slot', 'slot.student = student.id')
            .leftJoinAndSelect('detail.faculty', 'faculty')
            .getMany();
    }

    findAllFac(userId: number) {
        return this.repository.find({
            where: { faculty: userId },
            relations: ['slots', 'slots.student'],
        });
    }

    findById(id: number) {
        return this.repository.findOne(id);
    }

    saveDetail(detail: Detail) {
        return this.repository.save(detail);
    }
}
