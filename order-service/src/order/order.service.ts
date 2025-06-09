import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('INVENTORY_SERVICE') private inventoryClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // 1. Check inventory
      const inventoryResult = await firstValueFrom(
        this.inventoryClient.send('check_inventory', createOrderDto),
      );
      
      if (!inventoryResult.success) {
        throw new Error('Insufficient inventory');
      }
      // 2. Process payment
      const paymentResult = await firstValueFrom(
        this.paymentClient.send('process_payment', {
          orderId: createOrderDto.orderId,
          amount: createOrderDto.amount,
        }),
      );

      if (!paymentResult.success) {
        // Compensate inventory
        await firstValueFrom(
          this.inventoryClient.send('compensate_inventory', createOrderDto),
        );
        throw new Error('Payment failed');
      }

      // 3. Send notification
      await firstValueFrom(
        this.notificationClient.send('send_notification', {
          orderId: createOrderDto.orderId,
          message: 'Order created successfully',
        }),
      );

      return {
        success: true,
        message: 'Order created successfully',
        orderId: createOrderDto.orderId,
      };
    } catch (error) {
      console.log('createOrder error======3', error);
      
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getOrder(id: string) {
    // Implement get order logic
    return {
      orderId: id,
      status: 'COMPLETED',
    };
  }
} 