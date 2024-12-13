import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.entity';
import { ProductsCategory } from '../products_category/products_category.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ count: number; results: Products[] }> {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    return await this.productsService.findAll(pageNumber, pageSize, search);
  }

  @Get('categories')
  async getCategories(): Promise<{
    count: number;
    results: ProductsCategory[];
  }> {
    return await this.productsService.findAllCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Products> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() productData: Partial<Products>): Promise<Products> {
    return this.productsService.create(productData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<Products>,
  ): Promise<Products> {
    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
