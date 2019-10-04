import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Detail } from '../detail/models';
import { User } from '../../user/model';

@Entity('Appointment_slots')
export class Slot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @ManyToMany(() => User, User => User.Slot)
    User: User[];

    @ManyToOne(() => User, User => User.slots)
    student: User;

    @ManyToOne(() => Detail, Detail => Detail.slots)
    detail: Detail;
}
