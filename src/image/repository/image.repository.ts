import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { ImageDocument, Image } from '../schema/image.schema';

@Injectable()
export class ImageRepository extends EntityRepository<ImageDocument> {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
  ) {
    super(imageModel, null);
  }

  async findById(chapterId: string): Promise<Image[]> {
    const images = await this.imageModel.find({ id: chapterId });
    return images;
  }
}
