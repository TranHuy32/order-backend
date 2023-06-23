import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./schema/cart.schema";
import { ImageModule } from "src/image/image.module";
import { DishModule } from "src/dish/dish.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartRepository } from "./repository/cart.repository";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ImageModule,
    DishModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule { }
