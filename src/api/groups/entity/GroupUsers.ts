import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/User';
import { Group } from './Group';

export type Role = 'member' | 'mod' | 'owner';

@Entity()
export class GroupUser {
    @ManyToOne(() => User, User => User.group, { primary: true })
    user: User;

    @ManyToOne(() => Group, Group => Group.groupUsers, { primary: true })
    group: Group;

    @Column({ type: 'enum', enum: ['member', 'mod', 'owner'], default: 'member' })
    role: Role;
}
