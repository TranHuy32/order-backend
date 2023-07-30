import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  // @Post('create')
  // async createCallStaff(
  //   @Body() createCallStaffDto: CreateCallStaffDto,
  // ): Promise<CallStaffDocument> {
  //   return this.callStaffService.createCallStaff(createCallStaffDto);
  // }

  // Tạo call staff
  @Post('create/:cashierId')
  async createCallStaffByCashier(
    @Body() createCallStaffDto: CreateCallStaffDto,
    @Param('cashierId') cashierId: string,
  ): Promise<CallStaffDocument> {
    return this.callStaffService.createCallStaffByCashier(
      createCallStaffDto,
      cashierId,
    );
  }

  // all call staff
  @Get('/all')
  async allCallStaff(@Query() query: any) {
    return this.callStaffService.findAllCallStaff(query.time);
  }

  // all call staff by Cashier
  @Get('/all/:cashierId')
  async allCallStaffByCashierId(
    @Query() query: any,
    @Param('cashierId') cashierId: string,
  ) {
    return this.callStaffService.findAllCallStaffByCashier(
      cashierId,
      query.time,
    );
  }

  @Get('/customer/:cashierId')
  async allCallStaffByCustomer(
    @Query() query: any,
    @Param('cashierId') cashierId: string,
  ) {
    return this.callStaffService.findAllCallStaffCustomer(cashierId, query);
  }

  @UseGuards(CashierAuthGuard)
  @Delete('delete/:id')
  async deleteCallStaff(@Param('id') id: string) {
    return this.callStaffService.deleteCallStaff(id);
  }
}
