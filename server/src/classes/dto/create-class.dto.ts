import { Grade } from 'src/grades/entities/grade.entity';

export class CreateClassDto {
  name: string;
  grade: Grade;
}
