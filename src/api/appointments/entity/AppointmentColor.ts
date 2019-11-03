import { Entity, Column, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entity/User';
import { Detail } from './Detail';

// TODO: Review these fields and naming convention
// // Use other entities as a guide!
@Entity('Appointment_color')
export class AppointmentColor {
    @ManyToOne(() => User, User => User.appointmentColors, { primary: true })
    user: User;

    @OneToOne(() => Detail, Detail => Detail.colors, { primary: true })
    detail: Detail;

    @Column()
    hexColor: string;
}
