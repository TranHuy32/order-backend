import { Injectable } from '@nestjs/common';
import { ImageRepository } from './repository/image.repository';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDocument, Image } from './schema/image.schema';
import { Response } from 'express';
import { DishRepository } from 'src/dish/repository/dish.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly dishRepository: DishRepository) { }

  async createImage(
    createImageDto: CreateImageDto,
    image: Express.Multer.File,
  ): Promise<ImageDocument> {
    createImageDto.path = `${process.env.BASEURLIMAGE}${image.filename}`;
    const result = await this.imageRepository.createObject(createImageDto);
    return result;
  }
  async findImageById(_id: string): Promise<Image> {
    return await this.imageRepository.findOneObject({ _id });
  }
  async getImage(filename: string, res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }

}
