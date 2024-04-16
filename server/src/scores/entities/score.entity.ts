import { Student } from 'src/students/entities/student.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Student, student => student.scores)
  student: Student;
  @Column()
  midterm: number;
  @Column()
  final: number;
  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn()
  updatedAt: Date;
}
