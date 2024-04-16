import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}
  @WebSocketServer() wss: Server;
  @SubscribeMessage('createNotification')
  create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    return this.wss.emit('res', this.notificationsService.create(createNotificationDto));
  }

  @SubscribeMessage('findAllNotifications')
  async findAll() {
    const data = await this.notificationsService.findAll();
    return this.wss.emit('res', data);
  }

  @SubscribeMessage('findOneNotification')
  async findOne(@MessageBody() id: string) {
    const data = await this.notificationsService.findOne(id);
    console.log(id);
    return this.wss.emit('res', data);
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(updateNotificationDto.id, updateNotificationDto);
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this.notificationsService.remove(id);
  }
}
