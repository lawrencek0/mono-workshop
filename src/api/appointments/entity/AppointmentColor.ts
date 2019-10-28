import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Detail } from './Detail';
import { User } from '../../users/entity/User';

// TODO: Review these fields and naming convention
// Use other entities as a guide!
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
