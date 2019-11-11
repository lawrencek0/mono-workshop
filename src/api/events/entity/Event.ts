import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
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

    @ManyToOne(() => User, user => user.events)
    owner: User;

    // @ManyToMany(() => User, user => user.events)
    // @JoinTable({ name: 'event_roster' })
    // users: User[];

    @OneToMany(() => EventRoster, EventColor => EventColor.event, { onDelete: 'CASCADE' })
    eventRoster: EventRoster[];

    // @FIXME: should only store color in the join table
    // @Column()
    color: string;

    @OneToMany(() => GroupEventRoster, GroupEventRoster => GroupEventRoster.event, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    groupEvent: GroupEventRoster[];
}
