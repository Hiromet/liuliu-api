import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsCategoryService } from './products_category.service';
import { ProductsCategory } from './products_category.entity';

@Controller('products/categories')
export class ProductsCategoryController {
  constructor(private readonly categoryService: ProductsCategoryService) {}

  @Get()
  findAll(): Promise<{ count: number; results: ProductsCategory[] }> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ProductsCategory> {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() categoryData: Partial<ProductsCategory>): Promise<ProductsCategory> {
    return this.categoryService.create(categoryData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<ProductsCategory>): Promise<ProductsCategory> {
    return this.categoryService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
