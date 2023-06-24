import { Injectable } from '@nestjs/common';
import { Table, TableDocument } from '../schema/table.schema';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/repository/entity.repository';
import { Model } from 'mongoose';

@Injectable()
export class TableRepository extends EntityRepository<TableDocument> {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {
    super(tableModel, null);
  }
}
