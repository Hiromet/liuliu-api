import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategoryService } from './products_category.service';
import { ProductsCategoryController } from './products_category.controller';
import { ProductsCategory } from './products_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsCategory])],
  providers: [ProductsCategoryService],
  controllers: [ProductsCategoryController],
})
export class ProductsCategoryModule {}
