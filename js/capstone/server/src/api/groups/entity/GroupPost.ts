import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from './Group';
import { User } from '../../users/entity/User';

@Entity()
export class GroupPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    contents: string;

    @ManyToOne(
        () => User,
        User => User.posts,
    )
    poster: User;

    @ManyToOne(
        () => Group,
        Group => Group.posts,
    )
    group: Group;
}
