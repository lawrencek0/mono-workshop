import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Detail } from '../../appointments/entity/Detail';
import { AppointmentColor } from '../../appointments/entity/AppointmentColor';
import { Event } from '../../events/entity/Event';
import { EventColor } from '../../events/entity/Color';

export type Role = 'student' | 'faculty' | 'admin';

@Entity()
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

    @Column({
        unique: true,
    })
    @IsEmail()
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

    @OneToMany(() => AppointmentColor, AppointmentColor => AppointmentColor.userId)
    appColor: AppointmentColor[];

    @OneToMany(() => EventColor, EventColor => EventColor.user)
    eventColors: EventColor[];
    @OneToMany(() => AppointmentColor, AppointmentColor => AppointmentColor.user)
    appointmentColors: AppointmentColor[];
}
