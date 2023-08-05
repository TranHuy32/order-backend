import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CashierService } from 'src/cashier/cashier.service';
import { CreateCashierDto } from 'src/cashier/dto/create-cashier.dto';
import { ExistingCashier } from 'src/cashier/dto/exisiting-cashier.dto';
import { CashierDocument } from 'src/cashier/schema/cashier.schema';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class CashierAuthService {
  constructor(
    private readonly cashierService: CashierService,
    private readonly jwtService: JwtService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // Tao token
  private async _createToken(
    cashier: CashierDocument,
    refresh: boolean,
  ): Promise<any> {
    const accessToken = this.jwtService.sign({ cashier });
    const refreshToken = this.jwtService.sign(
      { cashier },
      {
        secret: process.env.SECRETKEY_REFRESH,
        expiresIn: process.env.EXPIRESIN_REFRESH,
      },
    );
    await this.cashierService.updateRefreshToken(cashier.cashierName, {
      refreshToken: refreshToken,
    });
    return { accessToken, refreshToken };
  }

  // login
  async login(existingCashier: ExistingCashier) {
    const { cashierName, password } = existingCashier;
    const cashier = await this.cashierService.validateCashier(
      cashierName,
      password,
    );
    if (!cashier) return false;
    const token = await this._createToken(cashier, false);
    await this.eventsGateway.login(cashier._id);
    return { ...token, cashier };
  }

  // register
  async register(newCashier: CreateCashierDto) {
    const existingCashier = await this.cashierService.findByCashierName(
      newCashier.cashierName,
    );
    if (existingCashier) return 'CashierName Existed!';
    newCashier.password = await this.cashierService.hashPassword(
      newCashier.password,
    );
    newCashier.createdAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return this.cashierService.createCashier(newCashier);
  }

  // Refresh token
  async refresh(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.SECRETKEY_REFRESH,
      });
      const cashier = await this.cashierService.getCashierByRefresh(
        refreshToken,
        payload.cashier.cashierName,
      );
      const newAccessToken = await this._createToken(cashier, true);
      return { newAccessToken, cashier };
    } catch (e) {
      return 'Invalid token';
    }
  }
}
