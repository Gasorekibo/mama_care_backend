import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/dist/messages/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(data: {
    content: string;
    senderId: number;
    receiverId: number;
  }) {
    const message = this.messageRepository.create({
      content: data.content,
      sender: { id: data.senderId },
      receiver: { id: data.receiverId },
    });
    return this.messageRepository.save(message);
  }

  async getPendingMessages(userId: number) {
    return this.messageRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async markAsRead(messageId: number) {
    await this.messageRepository.update(messageId, { isRead: true });
  }
}
