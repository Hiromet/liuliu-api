import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Products } from './products.entity';
import { ProductsCategory } from '../products_category/products_category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(ProductsCategory)
    private readonly productsCategoryRepository: Repository<ProductsCategory>,
  ) {}

  async findAll(
    pageNumber: number,
    pageSize: number,
    search?: string,
  ): Promise<{ count: number; results: any[] }> {
    const whereClause = search
      ? [
          { product_name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
        ]
      : {};

    const [results, count] = await this.productsRepository.findAndCount({
      where: whereClause,
      order: { id: 'ASC' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      relations: ['category'],
    });

    const formattedResults = results.map((product) => ({
      id: product.id,
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      category: product.category?.name,
    }));

    return { count, results: formattedResults };
  }

  async findAllCategories(): Promise<{
    count: number;
    results: ProductsCategory[];
  }> {
    const [results, count] =
      await this.productsCategoryRepository.findAndCount();
    return { count, results };
  }

  async findOne(id: number): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    return {
      id: product.id,
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      category: product.category?.id,
    };
  }

  create(productData: Partial<Products>): Promise<Products> {
    const newProduct = this.productsRepository.create(productData);
    return this.productsRepository.save(newProduct);
  }

  async update(id: number, updateData: Partial<Products>): Promise<Products> {
    await this.productsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
