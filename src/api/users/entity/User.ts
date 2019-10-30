import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Detail } from '../../appointments/entity/Detail';
// import { AppointmentColor } from '../../appointments/entity/AppointmentColor';

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

    // @OneToMany(() => AppointmentColor, AppointmentColor => AppointmentColor.user)
    // appointmentColors: AppointmentColor[];
}
