import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDocument } from './schema/category.schema';
import { CategoryRepository } from './repository/category.repository';
import { CashierService } from 'src/cashier/cashier.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cashierService: CashierService,
  ) {}

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
    cashierId: string,
  ): Promise<CategoryDocument> {
    const cashier = await this.cashierService.getByCashierId(cashierId);
    const group_id = cashier.group_id;
    const category = await this.categoryRepository.findOneObject({
      name,
      group_id,
    });
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
        group_id: category.group_id,
      };
    });
  }

  async findAllCatrgoriesByCashier(groupId: string): Promise<any> {
    const categories = await this.categoryRepository.findObjectWithoutLimit();
    const filteredCategories = categories.filter(
      (cat) => cat.group_id === groupId,
    );
    if (filteredCategories === null || filteredCategories.length === 0) {
      return 'No categories created';
    }
    return filteredCategories.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        group_id: category.group_id,
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
