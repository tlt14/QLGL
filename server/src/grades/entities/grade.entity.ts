/* eslint-disable prettier/prettier */
import { Class } from 'src/classes/entities/class.entity';
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @OneToMany(() => Class, classes => classes.grade)
  classes: Class[];

  @DeleteDateColumn()
  deletedAt: Date;
}
