/* eslint-disable prettier/prettier */
import { AttendanceRecord } from 'src/attendance-records/entities/attendance-record.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Score } from 'src/scores/entities/score.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, classEntity => classEntity.students)
  class: Class;

  @Column()
  full_name: string;

  @Column({ nullable: true, default: 0 })
  sex: string;

  @Column({ nullable: true })
  birthDay: Date;
  @Column({ nullable: true })
  baptism_day: Date;

  @Column({ nullable: true })
  holy_name: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  phone: string;
  @OneToMany(() => Score, score => score.student)
  scores: Score[];
  @DeleteDateColumn()
  deletedAt: Date;
}
