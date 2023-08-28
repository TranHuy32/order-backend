import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CallStaffService } from './call-staff.service';
import { CreateCallStaffDto } from './dto/create-call-staff.dto';
import { CallStaffDocument } from './schema/call-staff.schema';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';

@Controller('call-staff')
export class CallStaffController {
  constructor(private readonly callStaffService: CallStaffService) {}

  // Tạo call staff
  @Post('create/:groupId')
  async createCallStaffByGroup(
    @Body() createCallStaffDto: CreateCallStaffDto,
    @Param('groupId') groupId: string,
  ): Promise<CallStaffDocument> {
    return this.callStaffService.createCallStaffByGroup(
      createCallStaffDto,
      groupId,
    );
  }

  // all call staff by Cashier
  @Get('/all/:groupId')
  async allCallStaffByGroupId(
    @Query() query: any,
    @Param('groupId') groupId: string,
  ) {
    return this.callStaffService.findAllCallStaffByGroup(groupId, query.time);
  }

  @Get('/customer/:groupId')
  async allCallStaffByCustomer(
    @Query() query: any,
    @Param('groupId') groupId: string,
  ) {
    return this.callStaffService.findAllCallStaffCustomer(groupId, query);
  }

  @UseGuards(CashierAuthGuard)
  @Put('check/:id')
  async checkCallStaff(@Param('id') id: string) {
    return this.callStaffService.checkCallStaff(id);
  }

  @UseGuards(CashierAuthGuard)
  @Delete('delete/:id')
  async deleteCallStaff(@Param('id') id: string) {
    return this.callStaffService.deleteCallStaff(id);
  }
}
