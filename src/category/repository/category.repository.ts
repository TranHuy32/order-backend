import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { Category, CategoryDocument } from '../schema/category.schema';
@Injectable()
export class CategoryRepository extends EntityRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel, null);
  }
}
