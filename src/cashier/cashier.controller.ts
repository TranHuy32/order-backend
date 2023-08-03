import { Controller, Param, Get } from '@nestjs/common';
import { CashierService } from './cashier.service';

@Controller('cashier')
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @Get('/all')
  async findAllCashier(): Promise<any> {
    return this.cashierService.findAllCashier();
  }

  @Get('/:id')
  async findCashiertById(@Param('id') id: string): Promise<any> {
    return this.cashierService.getByCashierId(id);
  }
}
