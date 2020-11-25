// import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn, OneToOne } from 'typeorm';
// import { GroupAssignment } from './Assignment';
// import { User } from '../../users/entity/User';

// @Entity()
// export class AssignSubmissions {
//     @PrimaryColumn()
//     s3Bucket: string;

//     @ManyToOne(() => GroupAssignment, GroupAssignment => GroupAssignment.submissions)
//     assignment: GroupAssignment;

//     @OneToOne(() => User, User => User.submission)
//     poster: User;
// }
