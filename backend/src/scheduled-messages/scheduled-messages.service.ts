import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduledMessage, MessageStatus } from './scheduled-message.entity';
import { CreateScheduledMessageDto } from './dto/create-scheduled-message.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ScheduledMessagesService {
  constructor(
    @InjectRepository(ScheduledMessage)
    private scheduledMessagesRepository: Repository<ScheduledMessage>,
    private whatsappService: WhatsappService,
  ) {}

  async create(createDto: CreateScheduledMessageDto): Promise<ScheduledMessage> {
    const message = this.scheduledMessagesRepository.create({
      ...createDto,
      scheduledAt: new Date(createDto.scheduledAt),
    });
    return this.scheduledMessagesRepository.save(message);
  }

  async findAll(): Promise<ScheduledMessage[]> {
    return this.scheduledMessagesRepository.find({
      order: { scheduledAt: 'DESC' },
    });
  }

  async findPending(): Promise<ScheduledMessage[]> {
    return this.scheduledMessagesRepository.find({
      where: { status: MessageStatus.PENDING },
      order: { scheduledAt: 'ASC' },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledMessages() {
    console.log('Checking for scheduled messages to send...');
    
    const now = new Date();
    const messages = await this.scheduledMessagesRepository.find({
      where: {
        status: MessageStatus.PENDING,
        scheduledAt: LessThanOrEqual(now),
      },
    });

    console.log(`Found ${messages.length} messages to send`);

    for (const message of messages) {
      try {
        await this.whatsappService.sendMessage(message.contactId, message.message);
        
        message.status = MessageStatus.SENT;
        await this.scheduledMessagesRepository.save(message);
        
        console.log(`Message sent successfully to ${message.contactName}`);
      } catch (error) {
        console.error(`Failed to send message to ${message.contactName}:`, error.message);
        
        message.status = MessageStatus.FAILED;
        message.errorMessage = error.message;
        await this.scheduledMessagesRepository.save(message);
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.scheduledMessagesRepository.delete(id);
  }
}
