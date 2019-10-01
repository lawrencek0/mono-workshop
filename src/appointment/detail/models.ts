import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Slot } from '../slot/models';

@Entity()
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @OneToMany(type => Slot, Slot => Slot.Detail)
    Slot: Slot[];
}
