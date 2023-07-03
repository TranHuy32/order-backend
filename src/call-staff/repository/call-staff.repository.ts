import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { CallStaff, CallStaffDocument } from '../schema/call-staff.schema';
@Injectable()
export class CallStaffRepository extends EntityRepository<CallStaffDocument> {
  constructor(
    @InjectModel(CallStaff.name)
    private readonly callStaffModel: Model<CallStaffDocument>,
  ) {
    super(callStaffModel, null);
  }
}
