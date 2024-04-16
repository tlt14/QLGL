import { AttendanceSessionsService } from './../attendance-sessions/attendance-sessions.service';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';

@Injectable()
export class AttendanceRecordsService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordsRepository: Repository<AttendanceRecord>,
    // private readonly attendanceSessionsService: AttendanceSessionsService
    @InjectRepository(AttendanceSession)
    private readonly attendanceSessionsRepository: Repository<AttendanceSession>
  ) {}
  async create(attendanceRecordData: CreateAttendanceRecordDto): Promise<AttendanceRecord> {
    // Lưu vào cơ sở dữ liệu
    const savedAttendanceRecord = await this.attendanceRecordsRepository.save(attendanceRecordData);

    // Trả về AttendanceRecord đã được lưu
    return savedAttendanceRecord;
  }

  findAll() {
    return this.attendanceRecordsRepository.find({
      relations: ['attendanceSession', 'student'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceRecord`;
  }

  update(id: number, updateAttendanceRecordDto: UpdateAttendanceRecordDto) {
    return `This action updates a #${id} attendanceRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceRecord`;
  }

  removeStudentAttendanceRecord(studentId: string, sessionId: string) {
    return this.attendanceRecordsRepository.delete({
      student: {
        id: studentId,
      },
      attendanceSession: {
        id: sessionId,
      },
    });
  }

  // check student exists
  async getAttendanceRecordsByStudentId(studentId: string, sessionId: string) {
    const attendanceRecords = await this.attendanceRecordsRepository.findOne({
      where: {
        student: {
          id: studentId,
        },
        attendanceSession: {
          id: sessionId,
        },
      },
      select: {
        student: {
          id: true,
          full_name: true,
        },
      },
    });
    return attendanceRecords;
  }

  // remove attendance records by session id
  async removeAttendanceRecordsBySessionIdAndStudentId(sessionId: string, studentId: string) {
    const attendanceRecordId = await this.attendanceRecordsRepository.findOne({
      where: {
        student: {
          id: studentId,
        },
        attendanceSession: {
          id: sessionId,
        },
      },
    });
    console.log('============', sessionId, studentId, attendanceRecordId);
    return this.attendanceRecordsRepository.delete(attendanceRecordId.id);
  }

  async getAttendanceRecordsBySessionId(sessionId: string) {
    const attendanceSessions = await this.attendanceSessionsRepository.findOne({
      where: {
        id: sessionId,
      },
    });
    if (!attendanceSessions) {
      throw new BadRequestException(404, 'Session not found');
    }
    const attendanceRecords = await this.attendanceRecordsRepository.find({
      where: {
        attendanceSession: {
          id: sessionId,
        },
      },
      relations: ['student'],
      select: {
        student: {
          id: true,
          full_name: true,
        },
      },
      cache: true,
    });
    return {
      ...attendanceSessions,
      students: attendanceRecords,
    };
  }
  async getAttendanceRecordsByClassId(id: string) {
    const attendanceRecords = await this.attendanceRecordsRepository.find({
      where: {
        attendanceSession: {
          class: {
            id: id,
          },
        },
      },
      cache: true,
      relations: ['student', 'attendanceSession'],
      select: {
        student: {
          id: true,
          full_name: true,
        },
        attendanceSession: {
          session_date: true,
        },
      },
      order: {
        attendanceSession: {
          session_date: 'ASC',
        },
      },
    });

    const groupedAttendanceRecords = {};

    attendanceRecords.forEach(record => {
      const sessionDate = record.attendanceSession.session_date;
      if (!groupedAttendanceRecords[sessionDate]) {
        groupedAttendanceRecords[sessionDate] = [];
      }
      groupedAttendanceRecords[sessionDate].push(record);
    });

    return groupedAttendanceRecords;
  }
}
