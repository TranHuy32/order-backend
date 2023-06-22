import { Injectable } from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { ImageService } from 'src/image/image.service';
import { DishService } from 'src/dish/dish.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartDocument } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly dishService: DishService,
  ) {}

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
      const responeAllDish = await this.getCartOption(allCart, true);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }
}
