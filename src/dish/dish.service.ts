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
import { UpdateDishDto } from './dto/update-dish.dto';

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
      amount: dish.amount
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
    const category = await this.categoryService.findCategory(
      createDishDto.category,
    );
    if (!category) {
      const categoryCreated = await this.categoryService.createCategory(
        new CreateCategoryDto(createDishDto.category),
      );
      newDish.categories_name.push(categoryCreated.name);
    } else {
      newDish.categories_name.push(category.name);
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
    const limitedDishes = limit ? allDishes.slice(0, limit) : allDishes;
    for (const allDish of limitedDishes) {
      const responeAllDish = await this.getDishOption(allDish, true);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }
  async findAllDishesActived(limit?: number): Promise<any> {
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
    const filterActiveDishes = allDishes.filter(
      (allDishes) => allDishes.isActive === true,
    );
    const filterBestSellerDishes = filterActiveDishes.filter(
      (filterActiveDishes) => filterActiveDishes.isBestSeller === true,
    );
    const limitedDishes = limit
      ? filterBestSellerDishes.slice(0, limit)
      : filterBestSellerDishes;
    for (const allDish of limitedDishes) {
      const responeAllDish = await this.getDishOption(allDish, true);
      responeAllDishes.push(responeAllDish);
    }
    return responeAllDishes;
  }

  async findsByCategory(categoryName: string, limit?: number): Promise<any> {
    const dishes = await this.dishRepository.findObjectsBy(
      'category',
      categoryName,
    );
    let responseDishes: any[] = [];
    const filterActiveDishes = dishes.filter(
      (dishes) => dishes.isActive === true,
    );
    const limitedDishes = limit
      ? filterActiveDishes.slice(0, limit)
      : filterActiveDishes;
    for (const dish of limitedDishes) {
      const responseDish = await this.getDishOption(dish, false);
      responseDishes.push(responseDish);
    }
    return responseDishes;
  }

  async activeDish(_id: string, isActive: boolean): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (!dish) {
      return 'the dish has not been created yet';
    } else {
      if (isActive === dish.isActive) {
        return dish;
      }
      dish.isActive = isActive;
      await dish.save();
      return dish;
    }
<<<<<<< HEAD
  }
=======
  }  
>>>>>>> edf529cbade5cc6c559cf37efe478cf4fa52691e

  async isBestSeller(_id: string, isBestSeller: boolean): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (!dish) {
      return 'the dish has not been created yet';
    } else {
      if (isBestSeller === dish.isBestSeller) {
        return dish;
      }
      dish.isBestSeller = isBestSeller;
      await dish.save();
      return dish;
    }
  }

  async deleteDish(_id: string): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (!dish) {
      return 'Dish not found!';
    }
    const deleteResult = await this.dishRepository.deleteObjectById(_id);
    if (deleteResult) {
      return 'Successful delete';
    }
    return 'Failed to delete dish!';
  }

  async updateDish(
    _id: string,
    updateDishDto: UpdateDishDto,
    imageDetail: Express.Multer.File,
  ): Promise<DishDocument> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (imageDetail) {
      const imageUpdate = new CreateImageDto();
      const imageDetailCreated = await this.imageService.createImage(
        imageUpdate,
        imageDetail,
      );
      dish.image_detail_id = imageDetailCreated.id;
    }
    if (updateDishDto.category) {
      const category = await this.categoryService.findCategory(
        updateDishDto.category,
      );
      if (!category) {
        const categoryCreated = await this.categoryService.createCategory(
          new CreateCategoryDto(updateDishDto.category),
        );
        dish.category = categoryCreated.name;
      } else {
        dish.category = category.name;
      }
    }
    if (updateDishDto.description) {
      dish.description = updateDishDto.description;
    }
    if (updateDishDto.price) {
      dish.price = updateDishDto.price;
    }
    if (updateDishDto.name) {
      dish.name = updateDishDto.name;
    }
    if (updateDishDto.amount) {
      dish.amount = updateDishDto.amount;
    }
    dish.updateAt = new Date().toLocaleString('en-GB', {
      hour12: false,
    });
    await dish.save();
    return dish;
  }

  async addOption(_id: string, options: string[]): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (!dish) {
      return 'the dish has not been created yet';
    } else {
      if (dish.options instanceof Blob) {
        dish.options = options;
      } else {
        for (const option of options) {
          if (!dish.options.includes(option)) {
            dish.options.push(option);
          }
        }
      }
      await dish.save();
      return dish;
    }
  }

  async deleteOption(_id: string, options: string[]): Promise<any> {
    const dish = await this.dishRepository.findOneObject({ _id });
    if (!dish) {
      return 'The dish has not been created yet';
    } else {
      if (Array.isArray(dish.options)) {
        dish.options = dish.options.filter(
          (option) => !options.includes(option),
        );
      }
      await dish.save();
      return dish;
    }
  }
}
<<<<<<< HEAD
=======

>>>>>>> edf529cbade5cc6c559cf37efe478cf4fa52691e
