import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { detail } from '../detail/models';
import { user } from '.../user/model';

@Entity()
export class slot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @ManyToOne(type => detail, Detail => Detail.Slot)
    Detail: detail;

    @ManyToMany(type => user, User => User.Slot)
    @JoinTable()
    User: user[];
}
