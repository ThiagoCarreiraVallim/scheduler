import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private qrCode: string = null;
  private isReady: boolean = false;
  private contacts: any[] = [];

  async onModuleInit() {
    console.log('Initializing WhatsApp client...');
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session',
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
      },
    });

    this.client.on('qr', (qr) => {
      console.log('QR Code received');
      this.qrCode = qr;
    });

    this.client.on('ready', async () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
      this.qrCode = null;
      await this.loadContacts();
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failure', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });

    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
    }
  }

  async loadContacts() {
    try {
      const allContacts = await this.client.getContacts();
      
      // Filter only real contacts (not groups, broadcasts, etc)
      this.contacts = allContacts
        .filter(contact => contact.isUser && !contact.isMe && contact.name)
        .map(contact => ({
          id: contact.id._serialized,
          name: contact.name || contact.pushname || contact.number,
          number: contact.number,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log(`Loaded ${this.contacts.length} contacts`);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      this.contacts = [];
    }
  }

  getQrCode(): string | null {
    return this.qrCode;
  }

  isClientReady(): boolean {
    return this.isReady;
  }

  getContacts(): any[] {
    return this.contacts;
  }

  async sendMessage(contactId: string, message: string): Promise<void> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      await this.client.sendMessage(contactId, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
