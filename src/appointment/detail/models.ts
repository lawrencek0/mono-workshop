import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Slot } from '../slot/models';
import { User } from '../../user/model';

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

    @ManyToOne(() => User, User => User.Detail)
    user: User;
}
