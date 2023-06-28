import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
