import { Injectable } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { DishRepository } from './repository/dish.repository';
import { CreateDishDto } from './dto/create-dish.dto';
import { DishDocument } from './schema/dish.schema';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { ImageResponse } from 'src/image/dto/image-response.dto';
import { DishResponse } from './dto/dish-response.dto';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly imageService: ImageService,
    private readonly categoryService: CategoryService,
  ) {}

  async getDishOption(dish: DishDocument, isDetail: boolean): Promise<any> {
    const imagePath: { [key: string]: ImageResponse } = {
      image_detail: {
        id: dish.image_detail_id,
        path: (await this.imageService.findImageById(dish.image_detail_id))
          .path,
      },
    };
    if (isDetail) {
      return new DishResponse(dish, imagePath);
    }
    return {
      id: dish._id,
      name: dish.name,
      ...imagePath,
      createAt: dish.createAt,
      description: dish.description,
    };
  }

  async createDish(
    createDishDto: CreateDishDto,
    imageDetail: Express.Multer.File,
  ): Promise<DishDocument> {
    const newDish = Object.assign(createDishDto);
    const imageNew = new CreateImageDto();
    const imageDetailCreated = await this.imageService.createImage(
      imageNew,
      imageDetail,
    );
    newDish.image_detail_id = imageDetailCreated.id;
    newDish.categories_name = [];
    for (const categoryName of createDishDto.categories) {
      const category = await this.categoryService.findCategory(categoryName);
      if (!category) {
        const categoryCreated = await this.categoryService.createCategory(
          new CreateCategoryDto(categoryName),
        );
        newDish.categories_name.push(categoryCreated.name);
      } else {
        newDish.categories_name.push(category.name);
      }
    }
    newDish.createAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    return await this.dishRepository.createObject(newDish);
  }
  async findDishById(_id: string): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    return await this.getDishOption(dish, true);
  }

  async findAllDishes(limit?: number): Promise<any> {
    const allDishes = await this.dishRepository.findObjectWithoutLimit(); // xử lý limit ở dưới
    let responeAllDishes = <any>[];
    const filterAllDishes = allDishes.filter(
      (allDishes) => allDishes.isActive === true,
    );
    const limitedDishes = limit
      ? filterAllDishes.slice(0, limit)
      : filterAllDishes;
    for (const allDish of limitedDishes) {
      const responeAllDish = await this.getDishOption(allDish, true);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }

  async findBestSeller(limit?: number): Promise<any> {
    const allDishes = await this.dishRepository.findObjectWithoutLimit(); // xử lý limit ở dưới
    let responeAllDishes = <any>[];
    const filterAllDishes = allDishes.filter(
      (allDishes) => allDishes.isBestSeller === true,
    );
    const limitedDishes = limit
      ? filterAllDishes.slice(0, limit)
      : filterAllDishes;
    for (const allDish of limitedDishes) {
      const responeAllDish = await this.getDishOption(allDish, true);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }

  async findsByCategory(categoryName: string, limit?: number): Promise<any> {
    const dishes = await this.dishRepository.findObjectsBy(
      'categories',
      categoryName,
    );
    let responseDishes: any[] = [];
    const limitedDishes = limit ? dishes.slice(0, limit) : dishes;
    for (const dish of limitedDishes) {
      const responseDish = await this.getDishOption(dish, false);
      responseDishes.push(responseDish);
    }
    return responseDishes;
  }
  
}
