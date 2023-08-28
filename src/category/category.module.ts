import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schema/category.schema';
import { CashierModule } from 'src/cashier/cashier.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    CashierModule,
  ],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
