import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('scheduled_messages')
export class ScheduledMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contactId: string;

  @Column()
  contactName: string;

  @Column('text')
  message: string;

  @Column('timestamp')
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
