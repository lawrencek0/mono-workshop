import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Slot } from './Slot';
import { Detail } from './Detail';

export type Role = 'student' | 'faculty' | 'admin';

@Entity('User')
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

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: ['student', 'faculty', 'admin'],
        default: 'student',
    })
    role: Role;

    @Column()
    picUrl: string;

    @Column('text')
    bio: string;

    // @TODO: move to separate Student entity
    @ManyToMany(() => Detail, Detail => Detail.students)
    assignedDetails: Detail[];

    @OneToMany(() => Detail, Detail => Detail.faculty)
    details: Detail[];
}
