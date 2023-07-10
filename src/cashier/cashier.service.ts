import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CashierRepository } from './repository/cashier.repository';
import * as bcrypt from 'bcrypt';
import { CashierDocument } from './schema/cashier.schema';
import { CreateCashierDto } from './dto/create-cashier.dto';

@Injectable()
export class CashierService {
  constructor(private readonly cashierRepository: CashierRepository) {}

  //Brycpt
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Kiem tra nguoi dung
  async validateCashier(cashierName: string, password: string) {
    const cashier = await this.findByCashierName(cashierName);    
    if (!cashier) return null;
    const doesPasswordMath = await bcrypt.compare(password, cashier.password);
    if (!doesPasswordMath) return null;
    return this.getDetailCashier(cashier);
  }

  //Lay du lieu cashier
  async getDetailCashier(cashier: CashierDocument): Promise<any> {
    return {
      id: cashier._id,
      cashierName: cashier.cashierName,
    };
  }

  //Tao moi cashier
  async createCashier(
    createCashierDto: CreateCashierDto,
  ): Promise<CashierDocument> {
    return this.cashierRepository.createObject(createCashierDto);
  }

  // Tim kiem cashier theo cashierName
  async findByCashierName(cashierName: string): Promise<CashierDocument> {    
    return this.cashierRepository.findOneObject({ cashierName });
  }

  // Refresh token
  async updateRefreshToken(cashierName: string, update: any) {
    const existingCashier = await this.cashierRepository.findOneObject({
      cashierName,
    });
    if (existingCashier) {
      if (update.refreshToken) {
        update.refreshToken = await bcrypt.hash(
          update.refreshToken.split('').reverse().join(''),
          10,
        );
      }
      existingCashier.refreshToken = update.refreshToken;
    }
    console.log(existingCashier);
    
    return existingCashier.save();
  }
  async getCashierByRefresh(refreshToken: string, cashierName: string) {
    const cashier = await this.findByCashierName(cashierName);    
    if (!cashier) {
      throw new HttpException('not found cashier', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      refreshToken.split('').reverse().join(''),
      cashier.refreshToken,
    );
    if (!is_equal) {
      throw new HttpException('not found cashier', HttpStatus.UNAUTHORIZED);
    }
    return this.getDetailCashier(cashier);
  }

  // get cashier detail
  async getByCashierName(cashierName: string): Promise<CashierDocument> {
    const cashier = this.cashierRepository.findOneObject({ cashierName });
    if (!cashier) {
      throw new HttpException('not found cashier', HttpStatus.UNAUTHORIZED);
    }
    return cashier;
  }
}
