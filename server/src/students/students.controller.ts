import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Roles } from 'src/auth/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import Role from 'src/constants/role.enum';
import { ChangeClassDto } from './dto/change-class.dto';
import { ClassesService } from 'src/classes/classes.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  // @Roles(Role.ADMIN)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    console.log(createStudentDto);
    return this.studentsService.create(createStudentDto);
  }
  // @Roles(Role.ADMIN)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log(updateStudentDto);
    return this.studentsService.update(id, updateStudentDto);
  }
  // @Roles(Role.ADMIN)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Get(':id/classes')
  getClassesByStudentId(@Param('id') id: string) {
    return this.studentsService.getClassesByStudentId(id);
  }
  @Post(':studentId/:newClassId')
  async saveChanges(@Param('studentId') studentId: string, @Param('newClassId') newClassId: string): Promise<any> {
    return await this.studentsService.saveChanges(studentId, newClassId);
  }
  @Post('saveChanges')
  async handleChangeClass(@Body() changeClassDto: ChangeClassDto) {
    try {
      const result = await this.studentsService.handleChangeClass(changeClassDto);
      return result; // Return appropriate response (potentially success message or updated student data)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // Handle errors gracefully
    }
  }

  @Get(':phone/search')
  getAllInfoStudents(@Param('phone') phone: string) {
    return this.studentsService.getAllInfoStudents(phone);
  }
}
