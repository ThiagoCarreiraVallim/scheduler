import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateScheduledMessageDto {
  @IsString()
  @IsNotEmpty()
  contactId: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;
}
