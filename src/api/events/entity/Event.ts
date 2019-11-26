import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entity/User';
import { EventRoster } from './EventRoster';
import { GroupEventRoster } from '../../groups/entity/GroupEventRoster';

@Entity('Event')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column('text')
    location: string;

    @Column('text')
    description: string;

    @ManyToOne(() => User, user => user.events, { cascade: true, onDelete: 'CASCADE' })
    owner: User;

    // @ManyToMany(() => User, user => user.events)
    // @JoinTable({ name: 'event_roster' })
    // users: User[];

    @OneToMany(() => EventRoster, EventRoster => EventRoster.event)
    eventRoster: EventRoster[];

    @OneToMany(() => GroupEventRoster, GroupEventRoster => GroupEventRoster.event)
    groupEvent: GroupEventRoster[];
}
