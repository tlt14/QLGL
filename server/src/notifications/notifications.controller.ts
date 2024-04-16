import { Body, Controller, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.save(createNotificationDto);
  }
}
