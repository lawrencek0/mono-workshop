import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Detail } from './Detail';
import { User } from '../../users/entity/User';

@Entity('Appointment_color')
export class AppointmentColor {
    @ManyToOne(() => User, User => User.appColor, { primary: true })
    @JoinColumn({ name: 'userId' })
    userId: User;

    @ManyToOne(() => Detail, Detail => Detail.colors, { primary: true })
    @JoinColumn({ name: 'detailId' })
    appDet: Detail;

    @Column()
    hexColor: string;
}
