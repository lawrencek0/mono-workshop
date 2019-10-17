import { Entity, Column, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity('Event_color')
export class EventColor {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    eventId: number;

    @Column()
    hexColor: string;
}
