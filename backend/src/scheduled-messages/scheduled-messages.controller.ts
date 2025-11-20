import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ScheduledMessagesService } from './scheduled-messages.service';
import { CreateScheduledMessageDto } from './dto/create-scheduled-message.dto';
import { ScheduledMessage } from './scheduled-message.entity';

@Controller('scheduled-messages')
export class ScheduledMessagesController {
  constructor(private readonly scheduledMessagesService: ScheduledMessagesService) {}

  @Post()
  async create(@Body() createDto: CreateScheduledMessageDto): Promise<ScheduledMessage> {
    return this.scheduledMessagesService.create(createDto);
  }

  @Get()
  async findAll(): Promise<ScheduledMessage[]> {
    return this.scheduledMessagesService.findAll();
  }

  @Get('pending')
  async findPending(): Promise<ScheduledMessage[]> {
    return this.scheduledMessagesService.findPending();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.scheduledMessagesService.delete(id);
  }
}
