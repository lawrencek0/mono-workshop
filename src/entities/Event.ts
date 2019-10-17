import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';

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

    @ManyToMany(() => User)
    @JoinTable({ name: 'event_roster' })
    users: User[];
}
