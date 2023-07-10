import { Body, Controller, Post } from '@nestjs/common';
import { CreateCashierDto } from 'src/cashier/dto/create-cashier.dto';
import { ExistingCashier } from 'src/cashier/dto/exisiting-cashier.dto';
import { CashierAuthService } from './cashier.auth.service';

@Controller('cashier-auth')
export class CashierAuthController {
  constructor(private cashierAuthService: CashierAuthService) {}

  @Post('register')
  async register(@Body() newCashier: CreateCashierDto) {
    return await this.cashierAuthService.register(newCashier);
  }

  @Post('login')
  async login(@Body() existingCashier: ExistingCashier) {
    return await this.cashierAuthService.login(existingCashier);
  }

  @Post('refresh')
  async refreshToken(@Body() bodyToken: any) {
    const result = await this.cashierAuthService.refresh(
      bodyToken.refreshToken,
    );
    return result;
  }
}
