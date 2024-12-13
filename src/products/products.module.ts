import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from './products.entity';
import { ProductsCategory } from '../products_category/products_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, ProductsCategory])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
