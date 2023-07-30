import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CategoryService } from 'src/category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish, DishDocument } from './schema/dish.schema';
import { DishResponse } from './dto/dish-response.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';

@Controller('dish')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly categoryService: CategoryService,
  ) {}
  // Tạo dish
  @UseGuards(CashierAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image_detail'))
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @Req() req: any,
    @UploadedFile()
    image_detail: Express.Multer.File,
  ): Promise<DishDocument> {
    const cashier = req.user;
    return this.dishService.createDish(createDishDto, image_detail, cashier.id);
  }

  // Dish detail
  @Get('/:id')
  async findDishById(@Param('id') id: string): Promise<DishResponse> {
    return this.dishService.findDishById(id);
  }

  // All dishes
  @Get('menu/all')
  async findAllDish(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishes(query.limit);
  }

  // All dishes by cashier
  @Get('menu/allByCashier/:cashierId')
  async findAllDishByCashier(
    @Query() query,
    @Param('cashierId') cashierId: string,
  ): Promise<Dish[]> {
    return this.dishService.findAllDishesByCashier(cashierId, query.limit);
  }

  // All dishes actived
  @Get('menu/all-actived')
  async findAllDishActived(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishesActived(query.limit);
  }

  @Get('menu/activedByCashier/:cashierId')
  async findAllDishActivedByCashier(
    @Query() query,
    @Param('cashierId') cashierId: string,
  ): Promise<Dish[]> {
    return this.dishService.findAllDishesActivedByCashier(cashierId, query.limit);
  }

  // All dishes hidden
  @Get('menu/all-hidden')
  async findAllDishHidden(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishesHidden(query.limit);
  }

  // All dishes hidden by cashier
  // @UseGuards(CashierAuthGuard)
  @Get('menu/allHiddenByCashier/:cashierId')
  async findAllDishHiddenByCashier(
    @Query() query,
    @Param('cashierId') cashierId: any,
  ): Promise<Dish[]> {
    return this.dishService.findAllDishesHidden(cashierId, query.limit);
  }

  // All dishes best-seller
  // @Get('menu/best-seller')
  // async findBestSeller(@Query() query): Promise<Dish[]> {
  //   return this.dishService.findBestSeller(query.limit);
  // }

  // All dishes best-seller by cashier
  @Get('menu/bestSellerByCashier/:cashierId')
  async findBestSellerByCashier(
    @Query() query,
    @Param('cashierId') cashierId: any,
  ): Promise<Dish[]> {
    return this.dishService.findBestSellerByCashier(cashierId, query.limit);
  }

  // All dishes by category
  // @Get('/category/:categoryName')
  // async findDishesByCategory(
  //   @Param('categoryName') categoryName: string,
  //   @Query() query,
  // ): Promise<Dish[]> {
  //   return this.dishService.findsByCategory(categoryName, query.limit);
  // }

  // Active dish
  @UseGuards(CashierAuthGuard)
  @Put('/active/:id')
  async activeDish(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<DishResponse> {
    return this.dishService.activeDish(id, isActive);
  }

  // Set best seller dish
  @UseGuards(CashierAuthGuard)
  @Put('/best-seller/:cashierId')
  async bestSeller(
    @Param('cashierId') cashierId: string,
    @Body('isBestSeller') isBestSeller: boolean,
  ): Promise<DishResponse> {
    return this.dishService.isBestSeller(cashierId, isBestSeller);
  }

  // Delete dish
  @UseGuards(CashierAuthGuard)
  @Delete('/delete/:id')
  async deleteDish(@Param('id') id: string): Promise<any> {
    return this.dishService.deleteDish(id);
  }

  // Update dish
  @UseGuards(CashierAuthGuard)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image_detail'))
  async updateDish(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
    @Req() req: any,
    @UploadedFile()
    image_detail: Express.Multer.File,
  ): Promise<DishDocument> {
    const cashier = req.user;
    return this.dishService.updateDish(
      id,
      updateDishDto,
      image_detail,
      cashier.id,
    );
  }

  // Add option
  @UseGuards(CashierAuthGuard)
  @Post('add-option/:id')
  async addOption(
    @Param('id') id: string,
    @Body('option') option: string[],
  ): Promise<DishDocument> {
    return this.dishService.addOption(id, option);
  }

  // Delete option
  @UseGuards(CashierAuthGuard)
  @Delete('delete-option/:id')
  async deleteOption(
    @Param('id') id: string,
    @Body('option') option: string[],
  ): Promise<DishDocument> {
    return this.dishService.deleteOption(id, option);
  }
}
