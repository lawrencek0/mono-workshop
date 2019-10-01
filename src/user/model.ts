import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { slot } from '../appointment/slot/models';

export type Role = 'student' | 'faculty' | 'admin';

@Entity()
export class user {
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
        enum: ['student', 'editor', 'ghost'],
        default: 'student',
    })
    role: Role;

    @Column()
    pic_url: string;

    @Column('text')
    bio: string;

    @ManyToMany(type => slot, Slot => Slot.User)
    @JoinTable()
    User: user[];
}
