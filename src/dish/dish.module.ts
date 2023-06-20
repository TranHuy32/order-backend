import { Module } from '@nestjs/common';
import { DishesController } from './dish.controller';
import { DishesService } from './dish.service';

@Module({
  controllers: [DishesController],
  providers: [DishesService]
})
export class DishesModule {}
