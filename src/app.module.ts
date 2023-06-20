import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishesModule } from './dishes/dishes.module';
import { CashierModule } from './cashier/cashier.module';
import { CategoryModule } from './category/category.module';
import { BillModule } from './bill/bill.module';
import { IamgeModule } from './iamge/iamge.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [DishesModule, CashierModule, CategoryModule, BillModule, IamgeModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
