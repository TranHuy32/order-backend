import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from '../schema/group.schema';
import { EntityRepository } from 'src/repository/entity.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class GroupRepository extends EntityRepository<GroupDocument> {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {
    super(groupModel, null);
  }
}
