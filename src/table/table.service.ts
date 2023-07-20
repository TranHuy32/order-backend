import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableDocument } from './schema/table.schema';
import { TableRepository } from './repository/table.repository';
import { UpdateTableDto } from './dto/update-table.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class TableService {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createTable(createTableDto: CreateTableDto): Promise<TableDocument> {
    const name = createTableDto.name;
    const existingTable = await this.tableRepository.findOneObject({ name });
    if (existingTable) {
      throw new Error('This table already exists');
    }
    const newTable = Object.assign(createTableDto);
    newTable.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return await this.tableRepository.createObject(newTable);
  }

  async findAllTables(): Promise<any> {
    const tables = await this.tableRepository.findObjectWithoutLimit();
    if (tables === null || tables.length === 0) {
      throw new Error('No table created');
    }
    return tables.map((table) => {
      return {
        _id: table._id,
        name: table.name,
        isActive: table.isActive,
      };
    });
  }

  async findTableByName(name: string): Promise<TableDocument> {
    const existingTable = await this.tableRepository.findOneObject({ name });
    if (!existingTable) {
      throw new Error('The table does not existed');
    }
    return existingTable;
  }

  async deleteTable(name: string): Promise<any> {
    const table = await this.tableRepository.findOneObject({ name });
    if (!table) {
      throw new Error('The table does not existed');
    }
    if (await this.tableRepository.deleteObjectById(table._id)) {
      return 'Successful delete';
    }
    return 'Invalid table';
  }

  async activeTable(name: string, isActive: boolean): Promise<TableDocument> {
    const table = await this.tableRepository.findOneObject({ name });
    if (!table) {
      throw new Error('The table does not existed');
    }
    table.isActive = isActive;
    table.save();
    this.eventsGateway.activeTable(table);
    return table;
  }

  async updateTable(
    _id: string,
    updateTableDto: UpdateTableDto,
  ): Promise<TableDocument> {
    const table = await this.tableRepository.findOneObject({ _id });
    if (!table) {
      throw new Error('This table is not exist');
    }
    if (updateTableDto.name) {
      const name = updateTableDto.name;
      const existingTable = await this.tableRepository.findOneObject({
        name,
      });
      if (existingTable) {
        throw new Error('This table already exists');
      }
      table.name = updateTableDto.name;
    }
    table.updateAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    table.save();
    return table;
  }
}
