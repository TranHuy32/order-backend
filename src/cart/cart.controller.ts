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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart, CartDocument, CartStatus } from './schema/cart.schema';
import { CartResponse } from './dto/cart-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create/:groupId')
  async createDishByGroup(
    @Body() createCartDto: CreateCartDto,
    @Param('groupId') groupId: string,
  ): Promise<CartDocument> {
    return this.cartService.createCartByGroup(createCartDto, groupId);
  }

  // Cart detail
  @Get('/:id')
  async findCartById(@Param('id') id: string): Promise<CartResponse> {
    return this.cartService.findCartById(id);
  }

  @Get('menu/allByCashier/:groupId')
  async findAllCartsByCashier(
    @Query() query,
    @Param('groupId') groupId: string,
  ): Promise<Cart[]> {
    return this.cartService.findAllCartsByGroup(groupId, query);
  }

  @UseGuards(CashierAuthGuard)
  @Get('menu/all')
  async findAllCarts(@Query() query, @Req() req: any): Promise<Cart[]> {
    const cashier = req.user;
    return this.cartService.findAllCarts(cashier, query);
  }

  // History cart by group
  @Get('history/all/:groupId')
  async findCartByCustomer(
    @Query() query,
    @Param('groupId') groupId: string,
  ): Promise<Cart[]> {
    return this.cartService.findHistoryCarts(groupId, query);
  }

  // Status cart
  @UseGuards(CashierAuthGuard)
  @Put('/status/:id')
  async setStatus(
    @Param('id') id: string,
    @Body('status') status: CartStatus,
    @Req() req: any,
  ): Promise<CartResponse> {
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

  // @UseGuards(CashierAuthGuard)
  @Put('/payByStaff/:id')
  async payCartByStaff(@Param('id') id: string): Promise<boolean> {
    return this.cartService.payCartByStaff(id);
  }

  @Put('payByCustomer/:id')
  @UseInterceptors(FileInterceptor('image_payment'))
  async payCartByCustomer(
    @Param('id') id: string,
    @UploadedFile()
    image_payment: Express.Multer.File,
  ): Promise<boolean> {
    return this.cartService.payByCustomer(id, image_payment);
  }

  @Put('/selectCashMethod/:id')
  async selectCashMethod(@Param('id') id: string): Promise<boolean> {
    return this.cartService.selectCashMethod(id);
  }
}
