import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GroupUser } from './GroupUsers';
import { GroupEventRoster } from './GroupEventRoster';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(() => GroupUser, GroupUser => GroupUser.group)
    groupUsers: GroupUser[];

    @OneToMany(() => GroupEventRoster, GroupEventRoster => GroupEventRoster.group, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    event: GroupEventRoster[];
}
