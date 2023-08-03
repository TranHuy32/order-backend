import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableDocument } from './schema/table.schema';
import { TableRepository } from './repository/table.repository';
import { UpdateTableDto } from './dto/update-table.dto';
import { EventsGateway } from 'src/events/events.gateway';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TableService {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly eventsGateway: EventsGateway,
  ) {}

  public async hashToken(table_name: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(table_name, salt);
    const hashWithoutSlash = hash.replace(/\//g, '');
    return hashWithoutSlash;
  }

  async createTable(
    createTableDto: CreateTableDto,
    cashierId: any,
  ): Promise<TableDocument> {
    const name = createTableDto.name;
    const existingTable = await this.findTableByNameForCreate(
      name,
      createTableDto.cashier_id,
    );
    if (existingTable) {
      throw new Error('This table already exists');
    }
    const newTable = Object.assign(createTableDto);
    newTable.token = await this.hashToken(name);
    // newTable.cashier_id = cashierId;
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
        token: table.token,
      };
    });
  }

  async findAllTablesByCashier(cashierId: any): Promise<any> {
    const tables = await this.tableRepository.findObjectWithoutLimit();
    if (tables === null || tables.length === 0) {
      throw new Error('No table created');
    }

    const filteredTables = tables.filter(
      (table) => table.cashier_id === cashierId,
    );

    return filteredTables.map((table) => {
      return {
        _id: table._id,
        name: table.name,
        isActive: table.isActive,
        cashier_id: table.cashier_id,
        token: table.token,
      };
    });
  }

  async findTableByNameForCreate(
    name: string,
    cashierId: any,
  ): Promise<TableDocument> {
    const tables = await this.tableRepository.findObjectWithoutLimit();
    if (tables === null || tables.length === 0) {
      return null;
    }
    const filteredTables = tables.filter(
      (table) => table.cashier_id === cashierId,
    );
    const existingTable = filteredTables.find((table) => table.name === name);
    if (!existingTable) {
      return null;
    }
    return existingTable;
  }

  async findTableByName(name: string, cashierId: any): Promise<TableDocument> {
    const tables = await this.tableRepository.findObjectWithoutLimit();
    if (tables === null || tables.length === 0) {
      throw new Error('No table created');
    }
    const filteredTables = tables.filter(
      (table) => table.cashier_id === cashierId,
    );
    const existingTable = filteredTables.find((table) => table.name === name);
    if (!existingTable) {
      throw new Error('The table does not existed');
    }
    return existingTable;
  }

  async findTableById(_id: string): Promise<TableDocument> {
    const existingTable = await this.tableRepository.findOneObject({ _id });
    if (!existingTable) {
      throw new Error('The table does not existed');
    }
    return existingTable;
  }

  async findTableByToken(token: string): Promise<TableDocument> {
    const existingTable = await this.tableRepository.findOneObject({ token });
    if (!existingTable) {
      throw new Error('The table does not existed');
    }
    return existingTable;
  }

  async deleteTable(_id: string): Promise<any> {
    const table = await this.tableRepository.findOneObject({ _id });
    if (!table) {
      throw new Error('The table does not existed');
    }
    if (await this.tableRepository.deleteObjectById(table._id)) {
      return 'Successful delete';
    }
    return 'Invalid table';
  }

  async deleteTableById(_id: string): Promise<any> {
    const table = await this.tableRepository.findOneObject({ _id });
    if (!table) {
      throw new Error('The table does not existed');
    }
    if (await this.tableRepository.deleteObjectById(table._id)) {
      return 'Successful delete';
    }
    return 'Invalid table';
  }

  async activeTable(_id: string, isActive: boolean): Promise<TableDocument> {
    console.log(_id);
    const table = await this.tableRepository.findOneObject({ _id });
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
