import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/User';
import { Group } from './Group';

export type Role = 'member' | 'mod' | 'owner';

@Entity()
export class GroupUser {
    @ManyToOne(
        () => User,
        User => User.group,
        { primary: true, cascade: true, onDelete: 'CASCADE' },
    )
    user: User;

    @ManyToOne(
        () => Group,
        Group => Group.groupUsers,
        { primary: true, cascade: true, onDelete: 'CASCADE' },
    )
    group: Group;

    @Column({ type: 'enum', enum: ['member', 'mod', 'owner'], default: 'member' })
    role: Role;
}
