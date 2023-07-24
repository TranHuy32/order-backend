import { Body, Get, Put, Post, Controller, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart, CartDocument } from './schema/cart.schema';
import { CartResponse } from './dto/cart-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Tạo cart
  @Post('create')
  async createDish(
    @Body() createCartDto: CreateCartDto,
  ): Promise<CartDocument> {
    return this.cartService.createCart(createCartDto);
  }

  // Cart detail
  @Get('/:id')
  async findCartById(@Param('id') id: string): Promise<CartResponse> {
    return this.cartService.findCartById(id);
  }

  // All carts
  @Get('menu/all')
  async findAllCarts(@Query() query): Promise<Cart[]> {
    return this.cartService.findAllCarts(query);
  }

  // History cart
  @Get('history/all')
  async findCartByCustomer(@Body() body, @Query() query): Promise<Cart[]> {
    console.log(body);
    return this.cartService.findHistoryCarts(query, body);
  }
  // All carts backlog
  // @Get('menu/backlog')
  // async findAllCartsBackLog(@Query() query): Promise<Cart[]> {
  //     return this.cartService.findAllCartsBackLog(query.limit);
  // }

  // Status cart
  // @Put('/status/:id')
  // async setStatus(
  //     @Param('id') id: string,
  //     @Body('status') status: CartStatus,
  // ): Promise<CartResponse> {
  //     return this.cartService.setStatus(id, status);
  // }

  // Update cart
  @Put('update/:id')
  async updateDish(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    return this.cartService.updateCart(id, updateCartDto);
  }
}
