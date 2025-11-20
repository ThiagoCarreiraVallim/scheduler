import axios from 'axios';
import { Contact, ScheduledMessage, CreateScheduledMessage } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const whatsappApi = {
  getQrCode: async () => {
    const response = await api.get<{ qrCode: string | null; isReady: boolean }>('/whatsapp/qr');
    return response.data;
  },
  
  getStatus: async () => {
    const response = await api.get<{ isReady: boolean }>('/whatsapp/status');
    return response.data;
  },
  
  getContacts: async () => {
    const response = await api.get<{ contacts: Contact[] }>('/whatsapp/contacts');
    return response.data.contacts;
  },
};

export const messagesApi = {
  create: async (message: CreateScheduledMessage) => {
    const response = await api.post<ScheduledMessage>('/scheduled-messages', message);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get<ScheduledMessage[]>('/scheduled-messages');
    return response.data;
  },
  
  getPending: async () => {
    const response = await api.get<ScheduledMessage[]>('/scheduled-messages/pending');
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/scheduled-messages/${id}`);
  },
};
