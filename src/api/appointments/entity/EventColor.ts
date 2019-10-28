import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity('Event_color')
export class EventColor {
    @ManyToOne(() => User, User => User.eventColors, { primary: true })
    user: User;

    @ManyToOne(() => Event, Event => Event.colors, { primary: true })
    event: Event;

    @Column()
    color: string;
}
