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

  async createCallStaffByGroup(
    createCallStaffDto: CreateCallStaffDto,
    group_id: string,
  ): Promise<CallStaffDocument> {
    const newCallStaff = Object.assign(createCallStaffDto);
    const existingTable = await this.tableService.findTableByName(
      createCallStaffDto.table,
      group_id,
    );
    if (!existingTable) {
      throw new Error('The table does not exist');
    }
    // if (!existingTable.isActive) {
    //   throw new Error('This table is not active');
    // }
    newCallStaff.group_id = group_id;
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
      customer_name: callStaffCreated.customer_name,
      group_id: callStaffCreated.group_id,
    };
    await this.eventsGateway.createCallStaff(dataSocket);

    return callStaffCreated;
  }

  async findAllCallStaffByGroup(groupId: string, time?: number): Promise<any> {
    const callStaffsNoCashier =
      await this.callStaffRepository.findObjectWithoutLimit();
    const callStaffs = callStaffsNoCashier.filter(
      (callStaff) => callStaff.group_id === groupId,
    );
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
          group_id: callStaff.group_id,
          customer_name: callStaff.customer_name,
          isChecked: callStaff.isChecked,
        };
      });
    } else {
      const reversedCallStaffs = callStaffs.reverse(); // Đảo ngược thứ tự các phần tử trong mảng
      return reversedCallStaffs.map((callStaff) => {
        return {
          _id: callStaff._id,
          table: callStaff.table,
          createdAt: callStaff.createAt,
          customer_name: callStaff.customer_name,
          group_id: callStaff.group_id,
          isChecked: callStaff.isChecked,
        };
      });
    }
  }

  async findAllCallStaffCustomer(group_id: string, q?: any): Promise<any> {
    const callStaffsNoCashier =
      await this.callStaffRepository.findObjectWithoutLimit();
    const callStaffs = callStaffsNoCashier.filter(
      (callStaff) => callStaff.group_id === group_id,
    );
    if (callStaffs === null || callStaffs.length === 0) {
      return 'No call staff created';
    }
    const historyCallStaffs = callStaffs.filter(
      (callStaff) =>
        callStaff.table === q.table &&
        callStaff.customer_name === q.customer_name,
    );
    if (historyCallStaffs.length === 0) {
      return 'No matching call staff found';
    }
    const currentTime = moment(); // Lấy thời gian hiện tại
    const filteredCallStaffs = historyCallStaffs.filter((callStaff) => {
      const createdAt = moment(callStaff.createAt, 'DD/MM/YYYY, HH:mm:ss'); // Chuyển đổi thời gian tạo yêu cầu thành đối tượng Moment và định dạng theo 'DD/MM/YYYY, HH:mm:ss'
      const timeDifference = moment
        .duration(currentTime.diff(createdAt))
        .asMinutes(); // Tính khoảng thời gian trong phút
      return timeDifference <= 120;
    });
    const reversedCallStaffs = filteredCallStaffs.reverse(); // Đảo ngược thứ tự các phần tử trong mảng
    return reversedCallStaffs.map((callStaff) => {
      return {
        _id: callStaff._id,
        table: callStaff.table,
        createdAt: callStaff.createAt,
        customer_name: callStaff.customer_name,
      };
    });
  }

  async checkCallStaff(_id: string): Promise<boolean> {
    try {
      const callStaff = await this.callStaffRepository.findOneObject({ _id });
      if (!callStaff.isChecked) {
        callStaff.isChecked = true;
        callStaff.save();
        return true;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteCallStaff(id: string): Promise<any> {
    if (await this.callStaffRepository.deleteObjectById(id)) {
      return 'Successful delete';
    }
    return 'Invalid category';
  }
}
