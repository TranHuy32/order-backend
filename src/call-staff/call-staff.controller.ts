import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CallStaffService } from './call-staff.service';
import { CreateCallStaffDto } from './dto/create-call-staff.dto';
import { CallStaffDocument } from './schema/call-staff.schema';

@Controller('call-staff')
export class CallStaffController {
  constructor(private readonly callStaffService: CallStaffService) {}

  // Tạo call staff
  @Post('create')
  async createCallStaff(
    @Body() createCallStaffDto: CreateCallStaffDto,
  ): Promise<CallStaffDocument> {
    return this.callStaffService.createCallStaff(createCallStaffDto);
  }

  // all call staff
  @Get('/all')
  async allCallStaff() {
    return this.callStaffService.findAllCallStaff();
  }
  @Delete('delete/:id')
  async deleteCallStaff(@Param('id') id: string) {
    return this.callStaffService.deleteCallStaff(id);
  }
}
