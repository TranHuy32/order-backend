import { Injectable } from '@nestjs/common';
import { CallStaffRepository } from './repository/call-staff.repository';
import { CreateCallStaffDto } from './dto/create-call-staff.dto';
import { CallStaffDocument } from './schema/call-staff.schema';
import { TableService } from 'src/table/table.service';

@Injectable()
export class CallStaffService {
  constructor(
    private readonly callStaffRepository: CallStaffRepository,
    private readonly tableService: TableService,
  ) {}

  async createCallStaff(
    createCallStaffDto: CreateCallStaffDto,
  ): Promise<CallStaffDocument> {
    const newCallStaff = Object.assign(createCallStaffDto);
    const existingTable = await this.tableService.findTableByName(
      createCallStaffDto.table,
    );
    if (!existingTable) {
      throw new Error('The table does not exist');
    }
    if (!existingTable.isActive) {
      throw new Error('This table is not active');
    }
    newCallStaff.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return await this.callStaffRepository.createObject(newCallStaff);
  }

  async findAllCallStaff(): Promise<any> {
    const callStaffs = await this.callStaffRepository.findObjectWithoutLimit();
    if (callStaffs === null || callStaffs.length === 0) {
      return 'No call staff created';
    }
    return callStaffs.map((callStaff) => {
      return {
        _id: callStaff._id,
        table: callStaff.table,
      };
    });
  }

  async deleteCallStaff(id: string): Promise<any> {
    if (await this.callStaffRepository.deleteObjectById(id)) {
      return 'Successful delete';
    }
    return 'Invalid category';
  }
}
