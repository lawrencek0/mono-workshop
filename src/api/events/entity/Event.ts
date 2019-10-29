import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entity/User';
import { EventColor } from './Color';

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

    @ManyToMany(() => User, user => user.events)
    @JoinTable({ name: 'event_roster' })
    users: User[];

    @OneToMany(() => EventColor, EventColor => EventColor.event, { onDelete: 'CASCADE' })
    colors: EventColor[];

    @Column()
    color: string;
}
