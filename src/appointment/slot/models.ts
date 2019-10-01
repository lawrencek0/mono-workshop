import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Detail } from '../detail/models';
import { User } from '../../user/model';

@Entity()
export class Slot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @ManyToOne(type => Detail, Detail => Detail.Slot)
    Detail: Detail;

    @ManyToMany(type => User, User => User.Slot)
    @JoinTable()
    User: User[];
}
