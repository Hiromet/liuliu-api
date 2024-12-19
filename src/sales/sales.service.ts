import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sales.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Clients } from '../clients/clients.entity';
import { Products } from '../products/products.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const products = createSaleDto.products.map((id) => ({ id }) as Products);

    const newSale = this.salesRepository.create({
      client: { id: createSaleDto.client_id } as Clients,
      products: products,
      payment_status: 'pending',
      delivery_status: 'pending',
    });

    return this.salesRepository.save(newSale);
  }

  async findById(id: string) {
    const sale = await this.salesRepository.findOne({
      where: { order_id: id },
      relations: ['client', 'products'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const total = sale.products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    return {
      ...sale,
      total: total.toFixed(2),
    };
  }
}
