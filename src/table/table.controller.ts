import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('/create')
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto);
  }

  @Put('/update/:id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, updateTableDto);
  }

  @Get('/all')
  async allTables() {
    return this.tableService.findAllTables();
  }

  @Get('/detail/:name')
  async detaiTable(@Param('name') name: string) {
    return this.tableService.findTableByName(name);
  }

  @Delete('delete/:name')
  async deleteTable(@Param('name') name: string) {
    return this.tableService.deleteTable(name);
  }

  @Put('/active/:name')
  async activeTable(
    @Param('name') name: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.tableService.activeTable(name, isActive);
  }
}
