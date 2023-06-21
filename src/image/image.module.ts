import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, Image } from './schema/image.schema';
import { ImageRepository } from './repository/image.repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file 5MB
      },
    }),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
