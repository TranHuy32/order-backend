import { Injectable } from '@nestjs/common';
import { CallStaffRepository } from './repository/call-staff.repository';
import { CreateCallStaffDto } from './dto/create-call-staff.dto';
import { CallStaffDocument } from './schema/call-staff.schema';
import { TableService } from 'src/table/table.service';
import * as moment from 'moment';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class CallStaffService {
  constructor(
    private readonly callStaffRepository: CallStaffRepository,
    private readonly tableService: TableService,
    private readonly eventsGateway: EventsGateway,
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
    // if (!existingTable.isActive) {
    //   throw new Error('This table is not active');
    // }
    newCallStaff.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    const callStaffCreated = await this.callStaffRepository.createObject(
      newCallStaff,
    );
    const dataSocket = {
      _id: callStaffCreated._id,
      table: callStaffCreated.table,
      createdAt: callStaffCreated.createAt,
    };
    this.eventsGateway.createCallStaff(dataSocket);

    return callStaffCreated;
  }

  async findAllCallStaff(time?: number): Promise<any> {
    const callStaffs = await this.callStaffRepository.findObjectWithoutLimit();
    if (callStaffs === null || callStaffs.length === 0) {
      return 'No call staff created';
    }

    if (time !== undefined) {
      const currentTime = moment(); // Lấy thời gian hiện tại
      const filteredCallStaffs = callStaffs.filter((callStaff) => {
        const createdAt = moment(callStaff.createAt, 'DD/MM/YYYY, HH:mm:ss'); // Chuyển đổi thời gian tạo yêu cầu thành đối tượng Moment và định dạng theo 'DD/MM/YYYY, HH:mm:ss'
        const timeDifference = moment
          .duration(currentTime.diff(createdAt))
          .asMinutes(); // Tính khoảng thời gian trong phút

        return timeDifference <= time; // Lọc ra những yêu cầu trong vòng `time` phút
      });
      const reversedCallStaffs = filteredCallStaffs.reverse(); // Đảo ngược thứ tự các phần tử trong mảng
      return reversedCallStaffs.map((callStaff) => {
        return {
          _id: callStaff._id,
          table: callStaff.table,
          createdAt: callStaff.createAt,
        };
      });
    } else {
      const reversedCallStaffs = callStaffs.reverse(); // Đảo ngược thứ tự các phần tử trong mảng
      return reversedCallStaffs.map((callStaff) => {
        return {
          _id: callStaff._id,
          table: callStaff.table,
          createdAt: callStaff.createAt,
        };
      });
    }
  }

  async deleteCallStaff(id: string): Promise<any> {
    if (await this.callStaffRepository.deleteObjectById(id)) {
      return 'Successful delete';
    }
    return 'Invalid category';
  }
}
