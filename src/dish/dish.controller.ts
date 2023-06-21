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
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CategoryService } from 'src/category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish, DishDocument } from './schema/dish.schema';
import { DishResponse } from './dto/dish-response.dto';

@Controller('dish')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly categoryService: CategoryService,
  ) {}
  // Tạo dish
  @Post('create')
  @UseInterceptors(FileInterceptor('image_detail'))
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @Body('categories', ParseArrayPipe) categories: string[],
    @UploadedFile()
    image_detail: Express.Multer.File,
  ): Promise<DishDocument> {
    return this.dishService.createDish(
      { ...createDishDto, categories },
      image_detail,
    );
  }
  @Get('/:id')
  async findComicById(@Param('id') id: string): Promise<DishResponse> {
    return this.dishService.findDishById(id);
  }
  @Get('menu/all')
  async findAllDish(@Query() query): Promise<Dish[]> {
    return this.dishService.findAllDishes(query.limit);
  }
  @Get('menu/best-seller')
  async findBestSeller(@Query() query): Promise<Dish[]> {
    return this.dishService.findBestSeller(query.limit);
  }
  @Get('/category/:categoryName')
  async findDishesByCategory(
    @Param('categoryName') categoryName: string,
    @Query() query,
  ): Promise<Dish[]> {
    return this.dishService.findsByCategory(categoryName, query.limit);
  }
}
