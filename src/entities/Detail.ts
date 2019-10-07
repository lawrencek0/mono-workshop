import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Slot } from './Slot';
import { User } from './User';

@Entity('Appointment_details')
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @OneToMany(() => Slot, Slot => Slot.detail)
    slots: Slot[];

    @ManyToOne(() => User, User => User.details)
    faculty: User;

    @ManyToMany(() => User)
    @JoinTable({ name: 'appointment_details_users' })
    students: User[];
}
