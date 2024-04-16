import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GradesModule } from './grades/grades.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { AttendanceSessionsModule } from './attendance-sessions/attendance-sessions.module';
import { AttendanceRecordsModule } from './attendance-records/attendance-records.module';
import { ScoresModule } from './scores/scores.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesGuard } from './auth/guards/role.guard';
import { StudentsService } from './students/students.service';
import { Student } from './students/entities/student.entity';
import { Class } from './classes/entities/class.entity';
import { ClassesService } from './classes/classes.service';
import { UsersService } from './users/users.service';
import { User } from './users/entities/users.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'qlgl',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // AcademicYearModule,
    GradesModule,
    ClassesModule,
    StudentsModule,
    AttendanceSessionsModule,
    AttendanceRecordsModule,
    ScoresModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Student, Class, User]),
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, StudentsService, ClassesService, UsersService],
})
export class AppModule {}
