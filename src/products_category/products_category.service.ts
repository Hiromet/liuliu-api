import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsCategory } from './products_category.entity';

@Injectable()
export class ProductsCategoryService {
  constructor(
    @InjectRepository(ProductsCategory)
    private readonly categoryRepository: Repository<ProductsCategory>,
  ) {}

  async findAll(): Promise<{ count: number; results: ProductsCategory[] }> {
    const [results, count] = await this.categoryRepository.findAndCount();
    return { count, results };
  }

  findOne(id: number): Promise<ProductsCategory> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  create(categoryData: Partial<ProductsCategory>): Promise<ProductsCategory> {
    const newCategory = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateData: Partial<ProductsCategory>): Promise<ProductsCategory> {
    await this.categoryRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
