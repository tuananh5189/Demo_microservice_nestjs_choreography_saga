import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern('check_inventory')
  async checkInventory(@Payload() data: CreateOrderDto) {
    return this.inventoryService.checkInventory(data);
  }

  @MessagePattern('compensate_inventory')
  async compensateInventory(@Payload() data: CreateOrderDto) {
    return this.inventoryService.compensateInventory(data);
  }
} 