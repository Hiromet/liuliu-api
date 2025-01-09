import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sales.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

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
    //TODO: Set quantity in sales products
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
            { client: { firstname: `%${search}%` } },
            { client: { lastname: `%${search}%` } },
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

  // async generatePdf(id: string): Promise<Buffer> {
  //   const sale = await this.findById(id);
  //
  //   const templatePath = path.resolve(__dirname, 'template', 'receipt.html');
  //   const templateHtml = fs.readFileSync(templatePath, 'utf8');
  //
  //   const populatedHtml = templateHtml
  //     .replace('{{order_id}}', sale.order_id)
  //     .replace('{{created_at}}', new Date(sale.created_at).toLocaleDateString())
  //     .replace(
  //       '{{client_name}}',
  //       `${sale.client.firstname} ${sale.client.lastname}`,
  //     )
  //     .replace(
  //       '{{client_address}}',
  //       `${sale.client.address || ''}, ${sale.client.district}`,
  //     )
  //     .replace('{{client_phone}}', sale.client.phone_number)
  //     .replace('{{client_email}}', sale.client.email)
  //     .replace(
  //       '{{products}}',
  //       sale.products
  //         .map(
  //           (product) => `
  //       <tr>
  //         <td>${product.product_name}</td>
  //         <td>${product.quantity}</td>
  //         <td>S/${product.price}</td>
  //         <td>S/${(product.quantity * Number(product.price)).toFixed(2)}</td>
  //       </tr>`,
  //         )
  //         .join(''),
  //     )
  //     .replace('{{subtotal}}', `S/${sale.total}`)
  //     .replace('{{tax}}', 'S/0')
  //     .replace('{{total}}', `S/${sale.total}`);
  //
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.setContent(populatedHtml, { waitUntil: 'domcontentloaded' });
  //
  //   const pdfUint8Array = await page.pdf({ format: 'A4' });
  //   await browser.close();
  //
  //   const pdfBuffer = Buffer.from(pdfUint8Array);
  //
  //   return pdfBuffer;
  // }

}
