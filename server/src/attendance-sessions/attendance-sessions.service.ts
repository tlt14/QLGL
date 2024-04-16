import { ClassesService } from './../classes/classes.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';
import { AttendanceSession } from './entities/attendance-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecordsService } from 'src/attendance-records/attendance-records.service';

@Injectable()
export class AttendanceSessionsService {
  constructor(
    @InjectRepository(AttendanceSession)
    private readonly attendanceSessionsRepository: Repository<AttendanceSession>,
    private readonly classService: ClassesService,
    private readonly attendanceRecordsService: AttendanceRecordsService
  ) {}
  create(createAttendanceSessionDto: CreateAttendanceSessionDto) {
    // console.log(createAttendanceSessionDto);
    return this.attendanceSessionsRepository.save(createAttendanceSessionDto);
  }

  findAll() {
    return this.attendanceSessionsRepository.find({
      relations: ['class'],
    });
  }

  findOne(id: string) {
    return this.attendanceSessionsRepository.findOne({
      where: { id },
      relations: ['class'],
    });
  }

  update(id: number, updateAttendanceSessionDto: UpdateAttendanceSessionDto) {
    return `This action updates a #${id} attendanceSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceSession`;
  }
  getAttendanceRecordsBySessionId(id: string) {
    return this.attendanceSessionsRepository.findOne({
      where: { id },
      relations: ['attendanceRecords'],
    });
  }
  async getSessionIdByClassIdAndDate(id: string, date: Date) {
    console.log(new Date(date).toISOString().split('T')[0]);
    const data = await this.attendanceSessionsRepository.findOne({
      where: { class: { id }, session_date: new Date(date).toISOString().split('T')[0] },
    });
    if (!data?.id) {
      return {};
    }
    return data;
  }
  async createAttendance(data: any, idClass: string) {
    const sessionId = await this.getSessionIdByClassIdAndDate(idClass, data.date);
    if (Object.keys(sessionId).length === 0) {
      console.log('==============', data, idClass, sessionId);
      const myClass = await this.classService.findOne(idClass);
      const newSessionId = await this.create({
        session_date: new Date(data.date).toISOString().split('T')[0],
        description: data?.description,
        class: myClass,
      });
      return this.attendanceRecordsService.create({ attendanceSession: newSessionId, ...data });
    } else {
      // check student exists
      const check = await this.attendanceRecordsService.getAttendanceRecordsByStudentId(
        data.student,
        (sessionId as AttendanceSession)?.id
      );
      console.log('check============');
      if (check?.id) {
        return this.attendanceRecordsService.removeAttendanceRecordsBySessionIdAndStudentId(
          (sessionId as AttendanceSession)?.id,
          data.student
        );
      }
      return this.attendanceRecordsService.create({ attendanceSession: sessionId, ...data });
    }
  }
}
