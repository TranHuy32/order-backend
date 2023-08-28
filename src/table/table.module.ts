import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableRepository } from './repository/table.repository';
import { Table, TableSchema } from './schema/table.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';
import { CashierModule } from 'src/cashier/cashier.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
    EventsModule,
    CashierModule,
    GroupModule
  ],
  controllers: [TableController],
  exports: [TableService],
  providers: [TableService, TableRepository],
})
export class TableModule {}
