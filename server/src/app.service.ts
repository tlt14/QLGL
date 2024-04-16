import { ClassesService } from './classes/classes.service';
import { StudentsService } from './students/students.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly classesService: ClassesService,
    private readonly userService: UsersService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getDashboard() {
    return {
      totalStudents: (await this.studentsService.findAll()).length,
      totalClass: (await this.classesService.findAll()).length,
      totalUser: (await this.userService.findAll()).length,
    };
  }
}
