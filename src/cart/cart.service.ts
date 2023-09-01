import { Injectable } from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartDocument, CartStatus } from './schema/cart.schema';
import { CartResponse } from './dto/cart-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TableService } from 'src/table/table.service';
import { DishRepository } from 'src/dish/repository/dish.repository';
import * as moment from 'moment';
import { EventsGateway } from 'src/events/events.gateway';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly tableService: TableService,
    private readonly dishRepository: DishRepository,
    private readonly eventsGateway: EventsGateway,
    private readonly groupService: GroupService,
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
      customer_name: cart.customer_name,
      group_id: cart.group_id,
      isPaid: cart.isPaid,
    };
  }

  async createCartByGroup(
    createCartDto: CreateCartDto,
    group_id: string,
  ): Promise<CartDocument> {
    const newCart = Object.assign(createCartDto);
    const existingTable = await this.tableService.findTableByName(
      createCartDto.table,
      group_id,
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
    newCart.group_id = group_id;
    newCart.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    const newCartCreated = await this.cartRepository.createObject(newCart);
    const dataSocket = await this.getCartOption(newCartCreated, false);
    await this.eventsGateway.createCart(dataSocket);
    return newCartCreated;
  }

  async findObjectsByDate(date: string): Promise<CartDocument[] | null> {
    const startOfDay = moment(date, 'DD/MM/YYYY')
      .startOf('day')
      .format('DD/MM/YYYY, HH:mm:ss');
    const endOfDay = moment(date, 'DD/MM/YYYY')
      .endOf('day')
      .format('DD/MM/YYYY, HH:mm:ss');
    const result = await this.cartRepository.findObjectsBy('createAt', {
      $gte: startOfDay,
      $lte: endOfDay,
    });
    return result;
  }

  async findObjectsByDateByGroup(
    date: string,
    groupId: string,
  ): Promise<CartDocument[] | any> {
    const startOfDay = moment(date, 'DD/MM/YYYY')
      .startOf('day')
      .format('DD/MM/YYYY, HH:mm:ss');
    const endOfDay = moment(date, 'DD/MM/YYYY')
      .endOf('day')
      .format('DD/MM/YYYY, HH:mm:ss');
    const cartByCreated = await this.cartRepository.findObjectsBy('createAt', {
      $gte: startOfDay,
      $lte: endOfDay,
    });    
    const result = cartByCreated.filter((cart) => cart.group_id === groupId);
    if (result === null || result.length === 0) {
      return 'No carts created';
    }
    return result;
  }

  async findAllCarts(cashier: any, q?: any): Promise<any> {    
    const groups = await this.groupService.findAllGroupsByOwner(cashier.id);
    
    let allCarts = [];

    for (const group of groups) {
      const cartsInGroup = await this.cartRepository.findObjectsBy(
        'group_id',
        group._id,
      );
      allCarts = allCarts.concat(cartsInGroup);
    }

    if (allCarts === null || allCarts.length === 0) {
      return 'No carts created';
    }
    if (q.time !== undefined) {
      const currentTime = moment(); // Lấy thời gian hiện tại
      const filteredCarts = allCarts.filter((cart) => {
        const createdAt = moment(cart.createAt, 'DD/MM/YYYY, HH:mm:ss'); // Chuyển đổi thời gian tạo yêu cầu thành đối tượng Moment và định dạng theo 'DD/MM/YYYY, HH:mm:ss'
        const timeDifference = moment
          .duration(currentTime.diff(createdAt))
          .asMinutes(); // Tính khoảng thời gian trong phút

        return timeDifference <= q.time; // Lọc ra những yêu cầu trong vòng `time` phút
      });
      let responseAllCarts = [];
      for (const cart of filteredCarts) {
        const responseAllCart = await this.getCartOption(cart, false);
        responseAllCarts.push(responseAllCart);
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    } else if (q.date !== undefined) {
      let responseAllCarts = [];
      for (const group of groups) {
        const cartsByDate = await this.findObjectsByDateByGroup(
          q.date,
          group._id,
        );
        console.log(cartsByDate);
        
        for (const cart of cartsByDate) {
          const responseAllCart = await this.getCartOption(cart, false);
          responseAllCarts.push(responseAllCart);
        }
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    } else {
      let responseAllCarts = [];
      for (const cart of allCarts) {
        const responseAllCart = await this.getCartOption(cart, false);
        responseAllCarts.push(responseAllCart);
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    }
  }

  async findAllCartsByGroup(groupId: string, q?: any): Promise<any> {
    const allCartsNoGroupFilter =
      await this.cartRepository.findObjectWithoutLimit();
    const allCarts = allCartsNoGroupFilter.filter(
      (cart) => cart.group_id === groupId,
    );
    if (allCarts === null || allCarts.length === 0) {
      return 'No carts created';
    }
    if (q.time !== undefined) {
      const currentTime = moment(); // Lấy thời gian hiện tại
      const filteredCarts = allCarts.filter((cart) => {
        const createdAt = moment(cart.createAt, 'DD/MM/YYYY, HH:mm:ss'); // Chuyển đổi thời gian tạo yêu cầu thành đối tượng Moment và định dạng theo 'DD/MM/YYYY, HH:mm:ss'
        const timeDifference = moment
          .duration(currentTime.diff(createdAt))
          .asMinutes(); // Tính khoảng thời gian trong phút

        return timeDifference <= q.time; // Lọc ra những yêu cầu trong vòng `time` phút
      });
      let responseAllCarts = [];
      for (const cart of filteredCarts) {
        const responseAllCart = await this.getCartOption(cart, false);
        responseAllCarts.push(responseAllCart);
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    } else if (q.date !== undefined) {
      const cartsByDate = await this.findObjectsByDateByGroup(q.date, groupId);
      // if (cartsByDate === null || cartsByDate.length === 0) {
      //   return 'No carts created on the specified date';
      // }      
      let responseAllCarts = [];
      for (const cart of cartsByDate) {
        const responseAllCart = await this.getCartOption(cart, false);
        responseAllCarts.push(responseAllCart);
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    } else {
      let responseAllCarts = [];
      for (const cart of allCarts) {
        const responseAllCart = await this.getCartOption(cart, false);
        responseAllCarts.push(responseAllCart);
      }
      responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
      return responseAllCarts;
    }
  }

  async findHistoryCarts(groupId: string, q?: any): Promise<any> {
    const allCartsNoGroupFilter =
      await this.cartRepository.findObjectWithoutLimit();
    const allCarts = allCartsNoGroupFilter.filter(
      (cart) => cart.group_id === groupId,
    );
    if (allCarts === null || allCarts.length === 0) {
      return 'No carts created';
    }
    const historyCarts = allCarts.filter(
      (cart) =>
        cart.table === q.table && cart.customer_name === q.customer_name,
    );
    if (historyCarts.length === 0) {
      return 'No matching carts found';
    }
    const currentTime = moment(); // Lấy thời gian hiện tại
    const filteredCarts = historyCarts.filter((cart) => {
      const createdAt = moment(cart.createAt, 'DD/MM/YYYY, HH:mm:ss'); // Chuyển đổi thời gian tạo yêu cầu thành đối tượng Moment và định dạng theo 'DD/MM/YYYY, HH:mm:ss'
      const timeDifference = moment
        .duration(currentTime.diff(createdAt))
        .asMinutes(); // Tính khoảng thời gian trong phút
      return timeDifference <= 120; // Lọc ra những yêu cầu trong vòng `time` phút
    });
    let responseAllCarts = [];
    for (const cart of filteredCarts) {
      const responseAllCart = await this.getCartOption(cart, false);
      responseAllCarts.push(responseAllCart);
    }
    responseAllCarts.reverse(); // Đảo ngược thứ tự các giỏ hàng
    return responseAllCarts;
  }

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
      await this.eventsGateway.status(cart);
      return cart;
    }
  }

  async payCart(_id: string): Promise<any> {
    const cart = await this.cartRepository.findOneObject({ _id });
    if (!cart) {
      return 'the cart has not been created yet';
    } else {
      if (cart.isPaid === true) {
        return cart;
      }
      cart.isPaid = true;
      await cart.save();
      await this.eventsGateway.payCart(cart);
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
