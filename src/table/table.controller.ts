import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @UseGuards(CashierAuthGuard)
  @Post('/create')
  async createTable(@Body() createTableDto: CreateTableDto, @Req() req: any) {
    const cashier = req.user;
    return this.tableService.createTable(createTableDto, cashier.id);
  }

  @UseGuards(CashierAuthGuard)
  @Put('/update/:id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, updateTableDto);
  }

  // @UseGuards(CashierAuthGuard)
  @Get('/all')
  async allTables() {
    return this.tableService.findAllTables();
  }

  // @UseGuards(CashierAuthGuard)
  @Get('/allByCashier/:cashierId')
  async allTablesByCashier(@Param('cashierId') cashierId: string) {
    return this.tableService.findAllTablesByCashier(cashierId);
  }

  @UseGuards(CashierAuthGuard)
  @Get('/detail/:name')
  async detaiTable(@Param('name') name: string, @Req() req: any) {
    const cashier = req.user;
    return this.tableService.findTableByName(name, cashier.id);
  }

  @Get('/detailById/:id')
  async detaiTableId(@Param('id') id: string) {
    return this.tableService.findTableById(id);
  }

  @Get('/token/:token')
  async detaiTokenTable(@Param('token') token: string) {
    return this.tableService.findTableByToken(token);
  }

  // kh nene dung
  @UseGuards(CashierAuthGuard)
  @Delete('delete/:name')
  async deleteTable(@Param('name') name: string) {
    return this.tableService.deleteTable(name);
  }

  @UseGuards(CashierAuthGuard)
  @Delete('deleteById/:id')
  async deleteTableById(@Param('id') id: string) {
    return this.tableService.deleteTableById(id);
  }

  @UseGuards(CashierAuthGuard)
  @Put('/active/:id')
  async activeTable(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.tableService.activeTable(id, isActive);
  }
}
