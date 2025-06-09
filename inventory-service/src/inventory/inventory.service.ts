import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class InventoryService {
  private inventory = new Map<string, number>();

  constructor() {
    // Initialize some sample inventory
    this.inventory.set('product1', 100);
    this.inventory.set('product2', 50);
  }

  async checkInventory(data: CreateOrderDto) {
    const currentStock = this.inventory.get(data.productId) || 0;
    
    if (currentStock >= data.quantity) {
      // Update inventory
      this.inventory.set(data.productId, currentStock - data.quantity);
      return {
        success: true,
        message: 'Inventory check successful',
      };
    }

    return {
      success: false,
      message: 'Insufficient inventory',
    };
  }

  async compensateInventory(data: CreateOrderDto) {
    const currentStock = this.inventory.get(data.productId) || 0;
    this.inventory.set(data.productId, currentStock + data.quantity);
    
    return {
      success: true,
      message: 'Inventory compensated successfully',
    };
  }
} 