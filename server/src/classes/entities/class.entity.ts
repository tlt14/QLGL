import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Grade } from 'src/grades/entities/grade.entity';
import { Student } from 'src/students/entities/student.entity';
@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Grade, grade => grade.classes)
  grade: Grade;
  @Column()
  name: string;

  @OneToMany(() => Student, student => student.class)
  students: Student[];
}
