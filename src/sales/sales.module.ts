import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sales } from './sales.entity';
import { SalesProducts } from './sales-products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, SalesProducts])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
