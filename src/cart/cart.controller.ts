import {
  Body,
  Get,
  Put,
  Post,
  Controller,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart, CartDocument, CartStatus } from './schema/cart.schema';
import { CartResponse } from './dto/cart-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Tạo cart
  // @UseGuards(CashierAuthGuard)
  // @Post('create')
  // async createDish(
  //   @Body() createCartDto: CreateCartDto,
  // ): Promise<CartDocument> {
  //   return this.cartService.createCart(createCartDto);
  // }

  @Post('/create/:cashierId  ')
  async createDishByCashier(
    @Body() createCartDto: CreateCartDto,
    @Param('cashierId') cashierId: string,
    // @Req() req: any,
  ): Promise<CartDocument> {
    // const reqUser = req.user;    
    return this.cartService.createCartByCashier(createCartDto, cashierId);
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

  @Get('menu/all/:cashierId')
  async findAllCartsByCashier(
    @Query() query,
    @Param('cashierId') cashierId: string,
  ): Promise<Cart[]> {
    return this.cartService.findAllCartsByCashier(cashierId, query);
  }

  // History cart
  // @Get('history/all')
  // async findCartByCustomer(@Query() query): Promise<Cart[]> {
  //   return this.cartService.findHistoryCarts(query);
  // }

  // History cart by cashier
  @Get('history/all/:cashierId')
  async findCartByCustomer(
    @Query() query,
    @Param('cashierId') cashierId: string,
  ): Promise<Cart[]> {
    return this.cartService.findHistoryCarts(cashierId, query);
  }

  // All carts backlog
  // @Get('menu/backlog')
  // async findAllCartsBackLog(@Query() query): Promise<Cart[]> {
  //     return this.cartService.findAllCartsBackLog(query.limit);
  // }

  // Status cart
  @UseGuards(CashierAuthGuard)
  @Put('/status/:id')
  async setStatus(
    @Param('id') id: string,
    @Body('status') status: CartStatus,
    @Req() req: any,
  ): Promise<CartResponse> {
    // const cashier = req.user;
    return this.cartService.setStatus(id, status);
  }

  // Update cart
  @UseGuards(CashierAuthGuard)
  @Put('update/:id')
  async updateDish(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    return this.cartService.updateCart(id, updateCartDto);
  }
}
