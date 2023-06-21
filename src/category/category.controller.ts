import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // all category
  @Get('/all')
  async allCategory() {
    return this.categoryService.findAllCatrgories();
  }
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
