import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDocument } from './schema/category.schema';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {    
    return this.categoryRepository.createObject(createCategoryDto);
  }

  async findCategory(name: string): Promise<CategoryDocument> {
    return this.categoryRepository.findOneObject({ name });
  }

  async findCategoryByCashier(
    name: string,
    cashier_id: string,
  ): Promise<CategoryDocument> {
    //  const categories = this.categoryRepository.findOneObject({ cashier_id });
    const category = await this.categoryRepository.findOneObject({
      name,
      cashier_id,
    });
    //  const foundCategory = categories.find((category) => category.name === name);
    return category;
  }

  async findAllCatrgories(): Promise<any> {
    const categories = await this.categoryRepository.findObjectWithoutLimit();
    if (categories === null || categories.length === 0) {
      return 'No categories created';
    }
    return categories.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        cashier_id: category.cashier_id,
      };
    });
  }

  async findAllCatrgoriesByCashier(cashierId: string): Promise<any> {
    const categories = await this.categoryRepository.findObjectWithoutLimit();
    const filteredCategories = categories.filter(
      (cat) => cat.cashier_id === cashierId,
    );
    if (filteredCategories === null || filteredCategories.length === 0) {
      return 'No categories created';
    }
    return filteredCategories.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        cashier_id: category.cashier_id,
      };
    });
  }

  async deleteCategory(id: string): Promise<any> {
    if (await this.categoryRepository.deleteObjectById(id)) {
      return 'Successful delete';
    }
    return 'Invalid category';
  }
}
