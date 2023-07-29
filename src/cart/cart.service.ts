import { Injectable } from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartDocument, CartStatus } from './schema/cart.schema';
import { CartResponse } from './dto/cart-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TableService } from 'src/table/table.service';
import { DishRepository } from 'src/dish/repository/dish.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly tableService: TableService,
    private readonly dishRepository: DishRepository,
  ) {}

  async getCartOption(cart: CartDocument, isDetail: boolean): Promise<any> {
    if (isDetail) {
      return new CartResponse(cart);
    }
    const orderItems = [];
    for (const orderItem of cart.order) {
      const dish = await this.dishRepository.findOneObject({
        _id: orderItem.dish_id,
      });
      if (dish) {
        orderItems.push({
          ...orderItem,
          dish_name: dish.name,
          dish_price: dish.price,
          // Thêm các thông tin món ăn khác mà bạn muốn trả về
        });
      }
    }

    return {
      _id: cart._id,
      order: orderItems,
      note: cart.note,
      total: cart.total,
      status: cart.status,
      table: cart.table,
      createAt: cart.createAt,
    };
  }

  async createCart(createCartDto: CreateCartDto): Promise<CartDocument> {
    const newCart = Object.assign(createCartDto);
    const existingTable = await this.tableService.findTableByName(
      createCartDto.table,
    );
    if (!existingTable) {
      throw new Error('The table does not exist');
    }
    if (!existingTable.isActive) {
      throw new Error('This table is not active');
    }
    if (newCart.order.length === 0) {
      throw new Error('The order does not contain any dishes');
    }
    for (const dishOrder of newCart.order) {
      const dish = await this.dishRepository.findOneObject({
        _id: dishOrder.dish_id,
      });
      if (!dish) {
        throw new Error(`Dish with ID ${dishOrder.dish_id} does not exist`);
      }
      if (dish.amount <= 0) {
        throw new Error(`Dish with ID ${dishOrder.dish_id} is out of stock`);
      }
      if (dish.amount < dishOrder.number) {
        throw new Error(
          `Dish with ID ${dishOrder.dish_id} does not have enough quantity`,
        );
      }
    }
    for (const dishOrder of newCart.order) {
      const dish = await this.dishRepository.findOneObject({
        _id: dishOrder.dish_id,
      });
      dish.amount -= dishOrder.number;
      await dish.save();
    }

    newCart.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return await this.cartRepository.createObject(newCart);
  }

  async findAllCarts(limit?: number): Promise<any> {
    const allCarts = await this.cartRepository.findObjectWithoutLimit(); // xử lý limit ở dưới
    let responeAllCarts = <any>[];
    const limitedCarts = limit ? allCarts.slice(0, limit) : allCarts;
    for (const allCart of limitedCarts) {
      const responeAllCart = await this.getCartOption(allCart, false);
      responeAllCarts.push(responeAllCart);
    }
    return responeAllCarts;
  }
  // async findAllCartsBackLog(limit?: number): Promise<any> {
  //   const allCarts = await this.cartRepository.findObjectWithoutLimit();
  //   let responeAllcartes = <any>[];
  //   let filteredCarts = [];
  //   for (const allCart of allCarts) {
  //     if (allCart.status === 'IN_PROGRESS' || allCart.status === 'PENDING') {
  //       filteredCarts.push(allCart);
  //     }
  //   }
  //   const limitedCarts = limit ? filteredCarts.slice(0, limit) : filteredCarts;
  //   for (const limitedCart of limitedCarts) {
  //     const responeAllcart = await this.getCartOption(limitedCart, false);
  //     responeAllcartes.push(responeAllcart);
  //   }
  //   return responeAllcartes;
  // }

  async findCartById(_id: string): Promise<any> {
    const cart = await this.cartRepository.findOneObject({ _id });
    return await this.getCartOption(cart, true);
  }

  async setStatus(_id: string, status: CartStatus): Promise<any> {
    const cart = await this.cartRepository.findOneObject({ _id });
    if (!cart) {
      return 'the cart has not been created yet';
    } else {
      if (status === cart.status) {
        return cart;
      }
      cart.status = status;
      await cart.save();
      return cart;
    }
  }

  async updateCart(
    _id: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    const cart = await this.cartRepository.findOneObject({ _id });
    if (updateCartDto.table) {
      cart.table = updateCartDto.table;
    }
    if (updateCartDto.order) {
      cart.order = updateCartDto.order;
    }
    if (updateCartDto.total) {
      cart.total = updateCartDto.total;
    }
    if (updateCartDto.note) {
      cart.note = updateCartDto.note;
    }
    cart.updateAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    await cart.save();
    return cart;
  }
}
