import {
  Controller,
  Param,
  Get,
  UseGuards,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { CashierService } from './cashier.service';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';
import { UpdateCashierDto } from './dto/update-cashier.dto';

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

  @UseGuards(CashierAuthGuard)
  @Delete('delete/:id')
  async deleteCashier(@Param('id') id: string) {
    return this.cashierService.deleteCashier(id);
  }

  @UseGuards(CashierAuthGuard)
  @Put('update/:id')
  async updateCashier(
    @Body() updateCashietrDto: UpdateCashierDto,
    @Param('id') id: string,
  ) {
    return this.cashierService.updateCashier(id, updateCashietrDto);
  }
}
