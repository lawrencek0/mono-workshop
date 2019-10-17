import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Detail } from './Detail';
import { Event } from './Event';
import { EventColor } from './EventColor';
import { AppointmentColor } from './AppointmentColor';

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

    // @TODO: move to separate Student entity
    @ManyToMany(() => Detail, Detail => Detail.students)
    assignedDetails: Detail[];

    @OneToMany(() => Detail, Detail => Detail.faculty)
    details: Detail[];

    @OneToMany(() => Event, Event => Event.users)
    events: Event[];

    @OneToMany(() => EventColor, EventColor => EventColor.userId)
    evColor: EventColor[];

    @OneToMany(() => AppointmentColor, AppointmentColor => AppointmentColor.userId)
    appColor: AppointmentColor[];
}
