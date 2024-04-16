import { Class } from 'src/classes/entities/class.entity';

export class CreateStudentDto {
  class: Class;

  full_name: string;

  sex: string;

  birthDay: Date;
  baptism_day: Date;

  holy_name: string;

  father_name: string;

  mother_name: string;

  phone: string;
}
