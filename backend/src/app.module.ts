import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ScheduledMessagesModule } from './scheduled-messages/scheduled-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'scheduler',
      password: process.env.DB_PASSWORD || 'scheduler',
      database: process.env.DB_DATABASE || 'scheduler',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    ScheduleModule.forRoot(),
    WhatsappModule,
    ScheduledMessagesModule,
  ],
})
export class AppModule {}
