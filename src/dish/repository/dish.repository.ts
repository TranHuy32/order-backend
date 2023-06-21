import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/repository/entity.repository';
import { ImageService } from 'src/image/image.service';
import { Dish, DishDocument } from '../schema/dish.schema';

@Injectable()
export class DishRepository extends EntityRepository<DishDocument> {
  constructor(
    @InjectModel(Dish.name) private readonly dishModel: Model<DishDocument>,
    imageService: ImageService,
  ) {
    super(dishModel, imageService);
  }
}
