export interface Contact {
  id: string;
  name: string;
  number: string;
}

export interface ScheduledMessage {
  id: string;
  contactId: string;
  contactName: string;
  message: string;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduledMessage {
  contactId: string;
  contactName: string;
  message: string;
  scheduledAt: string;
}
