import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => AttendanceSession, attendanceSession => attendanceSession.id)
  attendanceSession: AttendanceSession;
  @ManyToOne(() => Student, student => student.id)
  student: Student;
  @Column({ nullable: true })
  status: string;
}
