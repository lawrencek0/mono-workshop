import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Detail } from '../../appointments/entity/Detail';
import { Event } from '../../events/entity/Event';
import { EventRoster } from '../../events/entity/EventRoster';
import { DetailUsers } from '../../appointments/entity/DetailsUsers';
import { GroupUser } from '../../groups/entity/GroupUsers';
import { GroupEventRoster } from '../../groups/entity/GroupEventRoster';
import { GroupPost } from '../../groups/entity/GroupPost';
// import { AssignSubmissions } from '../../groups/entity/Submissions';

export type Role = 'student' | 'faculty' | 'admin';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
    })
    firstName: string;

    @Column({
        length: 50,
    })
    lastName: string;

    @Column({
        unique: true,
    })
    @IsEmail()
    email: string;

    @Column({
        type: 'enum',
        enum: ['student', 'faculty', 'admin'],
        default: 'student',
    })
    role: Role;

    @Column({ nullable: true })
    picUrl: string;

    @Column({ nullable: true, type: 'text' })
    bio: string;

    // @TODO: move to separate Student entity
    // @ManyToMany(() => Detail, Detail => Detail.users)
    // assignedDetails: Detail[];

    @OneToMany(
        () => Detail,
        Detail => Detail.faculty,
    )
    details: Detail[];

    @OneToMany(
        () => Event,
        Event => Event.owner,
    )
    events: Event[];

    @OneToMany(
        () => EventRoster,
        EventRoster => EventRoster.user,
    )
    eventColors: EventRoster[];

    @OneToMany(
        () => DetailUsers,
        DetailUsers => DetailUsers.user,
    )
    appointmentColors: DetailUsers[];

    @OneToMany(
        () => GroupUser,
        GroupUser => GroupUser.user,
    )
    group: GroupUser[];

    @OneToMany(
        () => GroupEventRoster,
        GroupEventRoster => GroupEventRoster.user,
    )
    groupEvent: GroupEventRoster[];

    @OneToMany(
        () => GroupPost,
        GroupPost => GroupPost.poster,
    )
    posts: GroupPost[];

    // @OneToOne(() => AssignSubmissions, AssignSubmissions => AssignSubmissions.poster)
    // submission: AssignSubmissions;
}
