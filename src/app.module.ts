import { Module } from '@nestjs/common';
import { DishModule } from './dish/dish.module';
import { CashierModule } from './cashier/cashier.module';
import { CategoryModule } from './category/category.module';
import { BillModule } from './bill/bill.module';
import { ImageModule } from './image/image.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    DishModule,
    CashierModule,
    CategoryModule,
    BillModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
