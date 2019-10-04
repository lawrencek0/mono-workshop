import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
