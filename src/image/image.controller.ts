import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:filename')
  async getImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    return await this.imageService.getImage(filename, res);
  }
}
