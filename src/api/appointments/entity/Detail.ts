import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Slot } from './Slot';
import { User } from '../../users/entity/User';
import { DetailUsers } from './DetailsUsers';

@Entity('Appointment_details')
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @OneToMany(() => Slot, Slot => Slot.detail)
    slots: Slot[];

    @ManyToOne(() => User, User => User.details, { cascade: true, onDelete: 'CASCADE' })
    faculty: User;

    // @ManyToMany(() => User, User => User.assignedDetails, { cascade: true, onDelete: 'CASCADE' })
    // @JoinTable({ name: 'appointment_details_users' })
    // students: User[];

    @OneToMany(() => DetailUsers, DetailUsers => DetailUsers.detail)
    users: DetailUsers[];

    userProps?: DetailUsers;
}
