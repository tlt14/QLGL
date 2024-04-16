import { Module } from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import { AttendanceRecordsController } from './attendance-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { Student } from 'src/students/entities/student.entity';
import { AttendanceSession } from 'src/attendance-sessions/entities/attendance-session.entity';
import { AttendanceSessionsService } from 'src/attendance-sessions/attendance-sessions.service';
import { AttendanceSessionsModule } from 'src/attendance-sessions/attendance-sessions.module';
import { ClassesService } from 'src/classes/classes.service';
import { Class } from 'src/classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, Student, AttendanceSession, Class])],
  controllers: [AttendanceRecordsController],
  providers: [AttendanceRecordsService, AttendanceSessionsService, ClassesService],
})
export class AttendanceRecordsModule {}
