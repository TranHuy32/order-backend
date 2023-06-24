import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableRepository } from './repository/table.repository';
import { Table, TableSchema } from './schema/table.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  controllers: [TableController],
  exports: [TableService],
  providers: [TableService, TableRepository],
})
export class TableModule {}
