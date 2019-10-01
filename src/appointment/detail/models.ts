import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Slot } from '../slot/models';
import { User } from '../../user/model';

@Entity('Appointment_details')
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @OneToMany(type => Slot, Slot => Slot.Detail)
    Slot: Slot[];

    @ManyToOne(type => User, User => User.Detail)
    User: User[];
}
