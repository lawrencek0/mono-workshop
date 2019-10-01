import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { slot } from '../slot/models';

@Entity()
export class detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @OneToMany(type => slot, Slot => Slot.Detail)
    Slot: slot[];
}
