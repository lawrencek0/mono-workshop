// import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
// import { GroupPost } from './GroupPost';
// import { AssignSubmissions } from './Submissions';

// @Entity()
// export class GroupAssignment {
//     @OneToOne(() => GroupPost, GroupPost => GroupPost.id, { primary: true })
//     postId: GroupPost;

//     @Column()
//     deadline: Date;

//     @OneToMany(() => AssignSubmissions, AssignSubmissions => AssignSubmissions.assignment)
//     submissions: AssignSubmissions[];
// }
