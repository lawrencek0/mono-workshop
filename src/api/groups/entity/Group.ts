import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GroupUser } from './GroupUsers';
import { GroupEventRoster } from './GroupEventRoster';
import { GroupPost } from './GroupPost';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 1024 })
    description: string;

    @OneToMany(
        () => GroupUser,
        GroupUser => GroupUser.group,
    )
    groupUsers: GroupUser[];

    @OneToMany(
        () => GroupEventRoster,
        GroupEventRoster => GroupEventRoster.group,
    )
    events: GroupEventRoster[];

    @OneToMany(
        () => GroupPost,
        GroupPost => GroupPost.group,
    )
    posts: GroupPost[];
}
