import { Entity, Column, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity('Appointment_color')
export class AppointmentColor {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    detailId: number;

    @Column()
    hexColor: string;
}
