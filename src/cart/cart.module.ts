import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { ImageModule } from 'src/image/image.module';
import { CartController } from './cart.controller';
import { CartRepository } from './repository/cart.repository';
import { CartService } from './cart.service';
import { TableModule } from 'src/table/table.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ImageModule,
    TableModule,
    DishModule
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}
