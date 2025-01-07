import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './sales.entity';
import { Products } from '../products/products.entity';
import { Clients } from '../clients/clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Products, Clients])],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
