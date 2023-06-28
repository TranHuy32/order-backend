import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Dish, DishSchema } from './schema/dish.schema';
import { ImageModule } from 'src/image/image.module';
import { CategoryModule } from 'src/category/category.module';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { DishRepository } from './repository/dish.repository';

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
    MongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
    ImageModule,
    CategoryModule,
  ],
  controllers: [DishController],
  providers: [DishService, DishRepository],
  exports: [DishService, DishRepository],
})
export class DishModule {}
