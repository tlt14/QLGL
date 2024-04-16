// import { IsArray, IsString, IsOptional } from 'class-validator';

import { Student } from '../entities/student.entity';

export class ChangeClassDto {
  //   @IsString()
  classFrom: string;

  //   @IsString()
  classTo: string;

  //   @IsArray()
  //   @IsOptional()
  leftStudents?: Student[]; // Optional if students remain in the original class

  //   @IsArray()
  rightStudents: Student[];
}
