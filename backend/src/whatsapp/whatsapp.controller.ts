import { Controller, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('qr')
  getQrCode() {
    return {
      qrCode: this.whatsappService.getQrCode(),
      isReady: this.whatsappService.isClientReady(),
    };
  }

  @Get('status')
  getStatus() {
    return {
      isReady: this.whatsappService.isClientReady(),
    };
  }

  @Get('contacts')
  getContacts() {
    return {
      contacts: this.whatsappService.getContacts(),
    };
  }
}
