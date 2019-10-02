import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Slot } from '../appointment/slot/models';
import { Detail } from '../appointment/detail/models';

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
        enum: ['student', 'editor', 'ghost'],
        default: 'student',
    })
    role: Role;

    @Column()
    pic_url: string;

    @Column('text')
    bio: string;

    @ManyToMany(() => Slot, Slot => Slot.users)
    @JoinTable()
    Slot: Slot[];

    @OneToMany(() => Detail, Detail => Detail.user)
    Detail: Detail[];
}
