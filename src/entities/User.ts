import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Slot } from './Slot';
import { Detail } from './Detail';
import { Event } from './Event';

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

    @OneToMany(() => Detail, Detail => Detail.faculty)
    details: Detail[];

    @OneToMany(() => Event, Event => Event.owner)
    ownedEvents: Event[];

    @ManyToMany(() => Event, Event => Event.id)
    events: Event[];
}
