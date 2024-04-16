import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { Student } from 'src/students/entities/student.entity';

export class CreateAttendanceRecordDto {
  attendanceSession: AttendanceSession;
  student: Student;
  status?: string;
}
