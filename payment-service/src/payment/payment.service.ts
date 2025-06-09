import { Injectable } from '@nestjs/common';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  async processPayment(data: ProcessPaymentDto) {
    // Simulate payment processing
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      return {
        success: true,
        message: 'Payment processed successfully',
        orderId: data.orderId,
      };
    }

    return {
      success: false,
      message: 'Payment failed',
      orderId: data.orderId,
    };
  }
} 