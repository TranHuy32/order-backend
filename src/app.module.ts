import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DishModule } from "./dish/dish.module";
import { CategoryModule } from "./category/category.module";
import { CartModule } from "./cart/cart.module";
import { ImageModule } from "./image/image.module";

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
    CategoryModule,
    CartModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
