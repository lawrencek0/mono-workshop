import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/User';
import { Detail } from './Detail';

// TODO: Review these fields and naming convention
// // Use other entities as a guide!
@Entity('Appointment_details_users')
export class DetailUsers {
    @ManyToOne(() => User, User => User.appointmentColors, { primary: true, cascade: true, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Detail, Detail => Detail.users, { primary: true, cascade: true, onDelete: 'CASCADE' })
    detail: Detail;

    @Column()
    hexColor: string;
}
