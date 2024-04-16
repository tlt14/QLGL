import { Module } from '@nestjs/common';
import { AttendanceSessionsService } from './attendance-sessions.service';
import { AttendanceSessionsController } from './attendance-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceSession } from './entities/attendance-session.entity';
import { ClassesService } from 'src/classes/classes.service';
import { AttendanceRecordsService } from 'src/attendance-records/attendance-records.service';
import { Class } from 'src/classes/entities/class.entity';
import { AttendanceRecord } from 'src/attendance-records/entities/attendance-record.entity';
import { Student } from 'src/students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceSession, Class, AttendanceRecord, Student])],
  controllers: [AttendanceSessionsController],
  providers: [AttendanceSessionsService, ClassesService, AttendanceRecordsService],
})
export class AttendanceSessionsModule {}
