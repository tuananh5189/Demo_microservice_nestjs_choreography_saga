import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  async sendNotification(data: SendNotificationDto) {
    // Simulate sending notification
    console.log(`Sending notification for order ${data.orderId}: ${data.message}`);
    
    return {
      success: true,
      message: 'Notification sent successfully',
      orderId: data.orderId,
    };
  }
} 