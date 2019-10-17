import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Detail } from './Detail';

@Entity('Appointment_color')
export class AppointmentColor {
    @ManyToOne(() => User, User => User.appColor, { primary: true })
    @JoinColumn({ name: 'userId' })
    userId: User[];

    @ManyToOne(() => Detail, Detail => Detail.color, { primary: true })
    @JoinColumn({ name: 'detailId' })
    appDet: Detail;

    @Column()
    hexColor: string;
}
