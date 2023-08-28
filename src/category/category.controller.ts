import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // all category
  @Get('/all')
  async allCategory() {
    return this.categoryService.findAllCatrgories();
  }

  @Get('/allByCashier/:groupId')
  async allCategoryByCashier(@Param('groupId') groupId: string) {
    return this.categoryService.findAllCatrgoriesByCashier(groupId);
  }

  @UseGuards(CashierAuthGuard)
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
