import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./schema/cart.schema";
import { ImageModule } from "src/image/image.module";
import { CartController } from "./cart.controller";
import { CartRepository } from "./repository/cart.repository";
import { CartService } from "./cart.service";
import { DishModule } from "src/dish/dish.module";
import { TableModule } from "src/table/table.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ImageModule,
    DishModule,
    TableModule
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}