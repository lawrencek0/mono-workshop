import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { Detail } from './Detail';
import { User } from './User';

@Entity('Appointment_slots')
export class Slot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @ManyToMany(() => User, User => User.slots)
    students: User[];

    @ManyToOne(() => User, User => User.slots, { nullable: true })
    student: User;

    @ManyToOne(() => Detail, Detail => Detail.slots)
    detail: Detail;
}
