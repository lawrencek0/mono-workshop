import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/User';
import { Event } from './Event';
import { Role } from '../../groups/entity/GroupUsers';

@Entity('EventRoster')
export class EventRoster {
    @ManyToOne(() => User, User => User.eventColors, { primary: true, cascade: true, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Event, Event => Event.eventRoster, { primary: true, cascade: true, onDelete: 'CASCADE' })
    event: Event;

    @Column()
    color: string;

    @Column({ type: 'enum', enum: ['member', 'mod', 'owner'], default: 'member' })
    role: Role;
}
