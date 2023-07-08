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
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CategoryService } from 'src/category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish, DishDocument } from './schema/dish.schema';
import { DishResponse } from './dto/dish-response.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dish')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly categoryService: CategoryService,
  ) { }
  // Tạo dish
  @Post('create')
  @UseInterceptors(FileInterceptor('image_detail'))
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile()
    image_detail: Express.Multer.File,
  ): Promise<DishDocument> {
    return this.dishService.createDish(createDishDto, image_detail);
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

  // All dishes actived
  @Get('menu/all-actived')
  async findAllDishActived(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishesActived(query.limit);
  }

  // All dishes actived
  @Get('menu/all-hidden')
  async findAllDishHidden(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishesHidden(query.limit);
  }

  // All dishes best-seller
  @Get('menu/best-seller')
  async findBestSeller(@Query() query): Promise<Dish[]> {
    return this.dishService.findBestSeller(query.limit);
  }

  // All dishes by category
  @Get('/category/:categoryName')
  async findDishesByCategory(
    @Param('categoryName') categoryName: string,
    @Query() query,
  ): Promise<Dish[]> {
    return this.dishService.findsByCategory(categoryName, query.limit);
  }

  // Active dish
  @Put('/active/:id')
  async activeDish(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<DishResponse> {
    return this.dishService.activeDish(id, isActive);
  }

  // Set best seller dish
  @Put('/best-seller/:id')
  async bestSeller(
    @Param('id') id: string,
    @Body('isBestSeller') isBestSeller: boolean,
  ): Promise<DishResponse> {
    return this.dishService.isBestSeller(id, isBestSeller);
  }

  // Delete dish
  @Delete('/delete/:id')
  async deleteDish(@Param('id') id: string): Promise<any> {
    return this.dishService.deleteDish(id);
  }

  // Update dish
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image_detail'))
  async updateDish(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
    @UploadedFile()
    image_detail: Express.Multer.File,
  ): Promise<DishDocument> {
    return this.dishService.updateDish(id, updateDishDto, image_detail);
  }

  // Add option
  @Post('add-option/:id')
  async addOption(
    @Param('id') id: string,
    @Body('option') option: string[],
  ): Promise<DishDocument> {
    return this.dishService.addOption(id, option);
  }

  // Delete option
  @Delete('delete-option/:id')
  async deleteOption(
    @Param('id') id: string,
    @Body('option') option: string[],
  ): Promise<DishDocument> {
    return this.dishService.deleteOption(id, option);
  }
}
