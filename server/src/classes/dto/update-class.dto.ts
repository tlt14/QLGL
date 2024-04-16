import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { Student } from 'src/students/entities/student.entity';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  students: Student[];
}
