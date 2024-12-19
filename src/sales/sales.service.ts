import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sales.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const products = createSaleDto.products_ids.map((id) => ({ id }));

    const newSale = this.salesRepository.create({
      client: { id: createSaleDto.client_id },
      products: products,
      payment_status: createSaleDto.payment_status || 'pending',
      delivery_status: createSaleDto.delivery_status || 'pending',
    });

    return this.salesRepository.save(newSale);
  }

  async findAll() {
    return this.salesRepository.find({ relations: ['client', 'products'] });
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
    return { ...sale, total: total.toFixed(2) };
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.findById(id);
    const updatedSale = Object.assign(sale, updateSaleDto);
    return this.salesRepository.save(updatedSale);
  }

  async delete(id: string) {
    const result = await this.salesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return { message: 'Sale deleted successfully' };
  }
}
