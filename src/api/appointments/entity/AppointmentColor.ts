import { Entity, Column, ManyToOne } from 'typeorm';
import { Detail } from './Detail';
import { User } from '../../users/entity/User';

@Entity('Appointment_color')
export class AppointmentColor {
    @ManyToOne(() => User, User => User.appColor, { primary: true })
    userId: User;

    @ManyToOne(() => Detail, Detail => Detail.colors, { primary: true })
    appDet: Detail;

    @Column()
    hexColor: string;
}
