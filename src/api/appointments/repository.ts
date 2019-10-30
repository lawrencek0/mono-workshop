import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Detail } from './entity/Detail';
import { Slot } from './entity/Slot';

@Service()
export class SlotRepository {
    @InjectRepository(Slot)
    private repository: Repository<Slot>;

    // finds the slot by it's primary key
    findById(slotId: number) {
        return this.repository.findOne({ where: { id: slotId } });
    }

    // finds the slot that the student has taken for a certain detail (if any)
    findMyTaken(user: number, detail: number) {
        return this.repository
            .createQueryBuilder('slot')
            .where('slot.studentId = :studentId', { studentId: user })
            .innerJoinAndSelect('slot.detail', 'detail', 'slot.detailId = detail.id AND detail.id = :detailId', {
                detailId: detail,
            })
            .getOne();
    }

    deleteSlot(slotId: number, userId: number) {
        const isOwner = this.repository
            .createQueryBuilder('slot')
            .where('slot.id = :slotId', { slot: slotId })
            .innerJoinAndSelect(
                'slot.detail',
                'detail',
                'slot.detailId = detail.id AND detail.facultyId = :facultyId',
                {
                    facultyId: userId,
                },
            )
            .getOne();

        if (isOwner) {
            return this.repository
                .createQueryBuilder()
                .delete()
                .from(Slot)
                .where('id = :id', { id: slotId })
                .execute();
        } else {
            return 'no no';
        }
    }

    // creates or updates the given slot
    saveSlot(slot: Slot) {
        return this.repository.save(slot);
    }
}

@Service()
export class DetailRepository {
    @InjectRepository(Detail)
    private repository: Repository<Detail>;

    // finds all the appointments that a student is allowed to sign up for
    findAllStu(userId: number) {
        return this.repository
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId', { studentId: userId })
            .innerJoinAndSelect('detail.slots', 'slot', 'slot.student = student.id')
            .leftJoinAndSelect('detail.faculty', 'faculty')
            .getMany();
    }

    // finds the appointment details that a student still needs to sign up for
    findUntaken(userId: number) {
        const selectedAppointments = this.repository
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId', { studentId: userId })
            .innerJoin('detail.slots', 'slot', 'slot.student = student.id')
            .select('detail.id');

        return this.repository
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId')
            .where('detail.id NOT IN (' + selectedAppointments.getQuery() + ')')
            .setParameters(selectedAppointments.getParameters())
            .leftJoinAndSelect('detail.faculty', 'faculty')
            .getMany();
    }

    // runs the query to delete an appointment
    // slots and student associations are deleted by cascade
    deleteDetail(detailId: number, userId: number) {
        return this.repository
            .createQueryBuilder()
            .delete()
            .from(Detail)
            .where('id = :id AND facultyId = :facultyId', { id: detailId, facultyId: userId })
            .execute();
    }

    // finds all appointments that belong to user(must be faculty)
    // lists all slots with detail and the students that have selected them
    findAllFac(userId: number) {
        return this.repository.find({
            where: { faculty: userId },
            relations: ['slots', 'slots.student'],
        });
    }

    // finds the detail by using it's unique id
    findById(id: number) {
        return this.repository.findOne(id);
    }

    // creates or updates the detail
    saveDetail(detail: Detail) {
        return this.repository.save(detail);
    }
}
