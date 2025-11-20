import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledMessagesController } from './scheduled-messages.controller';
import { ScheduledMessagesService } from './scheduled-messages.service';
import { ScheduledMessage } from './scheduled-message.entity';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledMessage]),
    WhatsappModule,
  ],
  controllers: [ScheduledMessagesController],
  providers: [ScheduledMessagesService],
  exports: [ScheduledMessagesService],
})
export class ScheduledMessagesModule {}
