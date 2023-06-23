import { Injectable } from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { DishService } from 'src/dish/dish.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartDocument } from './schema/cart.schema';
import { ImageResponse } from 'src/image/dto/image-response.dto';
import { CartResponse } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly dishService: DishService,
  ) { }

  async getCartOption(cart: CartDocument, isDetail: boolean): Promise<any> {
    if (isDetail) {
      return new CartResponse(cart);
    }
    return {
      _id: cart._id,
      order: cart.order,
      note: cart.note,
      total: cart.total,
      status: cart.status,
      table: cart.table,
      createAt: cart.createAt,
    };
  }

  async createDish(createCartDto: CreateCartDto): Promise<CartDocument> {
    const newCart = Object.assign(createCartDto);
    newCart.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return await this.cartRepository.createObject(newCart);
  }
  async findAllCarts(limit?: number): Promise<any> {
    const allCarts = await this.cartRepository.findObjectWithoutLimit(); // xử lý limit ở dưới
    let responeAllDishes = <any>[];
    const limitedCarts = limit ? allCarts.slice(0, limit) : allCarts;
    for (const allCart of limitedCarts) {
      const responeAllDish = await this.getCartOption(allCart, false);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }

  async findAllCartsBackLog(limit?: number): Promise<any> {
    const allCarts = await this.cartRepository.findObjectWithoutLimit();
    let responeAllDishes = <any>[];
    let filteredCarts = [];

    for (const allCart of allCarts) {
      if (allCart.status === "IN_PROGRESS" || allCart.status === "PENDING") {
        filteredCarts.push(allCart);
      }
    }
    const limitedCarts = limit ? filteredCarts.slice(0, limit) : filteredCarts;
    for (const limitedCart of limitedCarts) {
      const responeAllDish = await this.getCartOption(limitedCart, false);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }

}
