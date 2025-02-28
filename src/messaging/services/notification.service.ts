import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationDTO } from '../dto/notification.dto';
import { Notification } from 'src/dist/notifications/notification.entity';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: NotificationDTO) {
    const notification = await this.notificationRepository.create({
      ...data,
      user: { id: data.userId },
      isRead: false,
    });
    return this.notificationRepository.save(notification);
  }

  async getPendingNotifications(userId: number, loggedInUserRole: UserRole) {
    const notification =
      loggedInUserRole === UserRole.HOSPITAL
        ? await this.notificationRepository.find({
            where: {
              hospital: { id: userId },
              isRead: false,
            },
            relations: ['user', 'hospital', 'senderUser'],
            order: {
              createdAt: 'DESC',
            },
          })
        : await this.notificationRepository.find({
            where: {
              user: { id: userId },
              isRead: false,
            },
            relations: ['user', 'hospital', 'senderUser'],
            order: {
              createdAt: 'DESC',
            },
          });
    return notification;
  }

  async markAsRead(notificationId: number) {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
