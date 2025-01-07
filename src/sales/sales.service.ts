import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Sale } from './sales.entity';
import { Products } from '../products/products.entity';
import { Clients } from '../clients/clients.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>,
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

  async findAll({
    search,
    page,
    limit,
  }: {
    search?: string;
    page: number;
    limit: number;
  }) {
    const offset = (page - 1) * limit;
    const [sales, total] = await this.salesRepository.findAndCount({
      relations: ['client', 'products'],
      where: search
        ? [
            { client: { firstname: Like(`%${search}%`) } },
            { client: { lastname: Like(`%${search}%`) } },
          ]
        : {},
      take: limit,
      skip: offset,
    });
    const results = sales.map((sale) => {
      const total = sale.products.reduce(
        (sum, product) => sum + Number(product.price),
        0,
      );
      return {
        order_id: sale.order_id,
        created_at: sale.created_at,
        payment_status: sale.payment_status,
        delivery_status: sale.delivery_status,
        client: {
          id: sale.client.id,
          firstname: sale.client.firstname,
          lastname: sale.client.lastname,
          phone_number: sale.client.phone_number,
          email: sale.client.email,
        },
        products: sale.products.map((product) => ({
          id: product.id,
          product_name: product.product_name,
          price: product.price,
        })),
        total: total.toFixed(2),
      };
    });
    return {
      count: total,
      results,
    };
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

  async generatePdf(id: string): Promise<Buffer> {
    const sale = await this.findById(id);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    let yPosition = height - 50;

    page.drawText('Sale Receipt', { x: 200, y: yPosition, size: 20, color: rgb(0, 0.5, 0) });

    yPosition -= 40;
    page.drawText('Order Summary', { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });
    yPosition -= 20;
    page.drawText(`Order ID: ${sale.order_id}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Date: ${new Date(sale.created_at).toString()}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Total: $${sale.total}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Payment Status: ${sale.payment_status}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Delivery Status: ${sale.delivery_status}`, { x: 50, y: yPosition, size: 12 });

    yPosition -= 30;
    page.drawText('Client Information', { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });
    yPosition -= 20;
    page.drawText(`Name: ${sale.client.firstname} ${sale.client.lastname}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Phone: ${sale.client.phone_number}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Email: ${sale.client.email}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 15;
    page.drawText(`Address: ${sale.client.address}`, { x: 50, y: yPosition, size: 12 });

    yPosition -= 30;
    page.drawText('Products', { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });
    yPosition -= 20;

    page.drawText('Product', { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0), underline: true });
    page.drawText('Price', { x: 300, y: yPosition, size: 12, color: rgb(0, 0, 0), underline: true });
    page.drawText('Quantity', { x: 400, y: yPosition, size: 12, color: rgb(0, 0, 0), underline: true });
    yPosition -= 20;

    sale.products.forEach((product) => {
      page.drawText(product.product_name, { x: 50, y: yPosition, size: 12 });
      page.drawText(`$${product.price}`, { x: 300, y: yPosition, size: 12 });
      page.drawText(`${product.quantity}`, { x: 400, y: yPosition, size: 12 });
      yPosition -= 20;
    });

    yPosition -= 30;
    page.drawText(`Total: $${sale.total}`, { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
