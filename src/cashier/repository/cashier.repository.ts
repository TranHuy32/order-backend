import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageService } from '../../image/image.service';
import { EntityRepository } from '../../repository/entity.repository';
import { Cashier, CashierDocument } from '../schema/cashier.schema';
import { CreateCashierDto } from '../dto/create-cashier.dto';

@Injectable()
export class CashierRepository extends EntityRepository<CashierDocument> {
  constructor(
    @InjectModel(Cashier.name)
    private readonly cashierModel: Model<CashierDocument>,
    imageService: ImageService,
  ) {
    super(cashierModel, imageService);
  }
  async createCashier(createCashierDto: CreateCashierDto): Promise<Cashier> {
    const cashier = new this.cashierModel(createCashierDto);
    return cashier.save();
  }
}
