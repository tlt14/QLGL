import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { ChangeClassDto } from './dto/change-class.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Class) private classRepository: Repository<Class>
  ) {}
  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.save(createStudentDto);
  }

  findAll() {
    return this.studentRepository.find({
      relations: ['class', 'class.grade', 'scores'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: string) {
    return this.studentRepository.softDelete(id);
  }

  getClassesByStudentId(id: string) {
    return this.studentRepository
      .createQueryBuilder('student')
      .where('class.id = :id', { id })
      .leftJoinAndSelect('student.class', 'class')
      .leftJoinAndSelect('class.grade', 'grade')
      .getMany();
  }
  async saveChanges(studentId, newClassId): Promise<any> {
    const student = await this.studentRepository.findOne({
      where: {
        id: studentId,
      },
    });
    if (!student) {
      throw new Error('Student not found');
    }

    // Update student's class
    student.class.id = newClassId;

    // Save changes
    try {
      return await this.studentRepository.save(student);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async handleChangeClass(changeClassDto: ChangeClassDto) {
    const { classFrom, classTo, leftStudents, rightStudents } = changeClassDto;
    // console.log({
    //   classFrom,
    //   classTo,
    //   leftStudents,
    //   rightStudents,
    // });
    const updatePromises = [];

    // Update students in `leftStudents`
    for (const studentId of leftStudents) {
      updatePromises.push(this.updateStudentClass(studentId, classFrom));
    }

    // Update students in `rightStudents`
    for (const studentId of rightStudents) {
      updatePromises.push(this.updateStudentClass(studentId, classTo));
    }

    await Promise.all(updatePromises);

    // Optionally, return updated student data or a success message
    return { message: 'Students class assignments updated successfully.' };
  }

  private async updateStudentClass(studentId: Student, classId: string) {
    console.log({ studentId, classId });
    const student = await this.studentRepository.findOne({
      where: {
        id: studentId.id,
      },
    });
    if (!student) {
      throw new Error('Student not found');
    }

    const newClass = await this.classRepository.findOne({
      where: {
        id: classId,
      },
    });
    if (!newClass) {
      throw new Error('Class not found');
    }

    student.class = newClass;
    await this.studentRepository.save(student);
  }

  getAllInfoStudents(phone: string) {
    console.log({ phone });
    return this.studentRepository
      .createQueryBuilder('student')
      .where('phone = :phone', { phone })
      .leftJoinAndSelect('student.class', 'class')
      .leftJoinAndSelect('class.grade', 'grade')
      .leftJoinAndSelect('student.scores', 'scores')
      .getMany();
  }
}
