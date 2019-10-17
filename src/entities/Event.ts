import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './User';
import { EventColor } from './EventColor';

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

    @ManyToOne(() => User, User => User.events)
    owner: User;

    @ManyToMany(() => User, User => User.events)
    @JoinTable({ name: 'event_roster' })
    users: User[];

    @OneToMany(() => EventColor, EventColor => EventColor.event)
    colors: EventColor[];

    color: string;
}
