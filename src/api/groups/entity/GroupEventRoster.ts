import { Entity, Column, ManyToOne } from 'typeorm';
import { Group } from './Group';
import { Event } from '../../events/entity/Event';
import { User } from '../../users/entity/User';

@Entity()
export class GroupEventRoster {
    @ManyToOne(() => Group, Group => Group.id, { primary: true })
    group: Group;

    @ManyToOne(() => Event, Event => Event.groupEvent)
    event: Event;

    @ManyToOne(() => User, User => User.group)
    user: User;

    @Column()
    going: boolean;
}
