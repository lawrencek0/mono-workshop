import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Slot } from '../appointment/slot/models';
import { Detail } from '../appointment/detail/models';

export type Role = 'student' | 'faculty' | 'admin';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
    })
    firstName: string;

    @Column({
        length: 50,
    })
    lastName: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: ['student', 'faculty', 'admin'],
        default: 'student',
    })
    role: Role;

    @Column()
    picUrl: string;

    @Column('text')
    bio: string;

    @OneToMany(() => Slot, Slot => Slot.student)
    slots: Slot[];

    @ManyToMany(() => Slot, Slot => Slot.User)
    @JoinTable({ name: 'appointment_slots_users' })
    Slot: Slot[];

    @OneToMany(() => Detail, Detail => Detail.user)
    Detail: Detail[];
}
