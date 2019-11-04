import { Entity, Column, ManyToOne } from 'typeorm';
import { Detail } from './Detail';
import { User } from '../../users/entity/User';

@Entity('Appointment_color')
export class AppointmentColor {
    @ManyToOne(() => User, User => User.appColor, { primary: true })
    user: User;

    @ManyToOne(() => Detail, Detail => Detail.colors, { primary: true })
    detail: Detail;

    @Column()
    hexColor: string;
}
