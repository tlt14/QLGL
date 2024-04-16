import { Class } from 'src/classes/entities/class.entity';

export class CreateAttendanceSessionDto {
  class: Class;
  session_date: string;
  description: string;
}
