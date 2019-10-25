import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Detail } from './Detail';
import { User } from '../../users/entity/User';

@Entity('Appointment_slots')
export class Slot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @ManyToOne(() => User, User => User.id, { nullable: true })
    student: User;

    @ManyToOne(() => Detail, Detail => Detail.slots)
    detail: Detail;
}
