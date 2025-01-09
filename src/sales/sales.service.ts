import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Sales } from "./sales.entity";
import { SalesProducts } from "./sales-products.entity";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
    @InjectRepository(SalesProducts)
    private readonly salesProductsRepository: Repository<SalesProducts>
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const sale = this.salesRepository.create({
      client: { id: Number(createSaleDto.client_id) },
      payment_status: createSaleDto.payment_status || "pending",
      delivery_status: createSaleDto.delivery_status || "pending",
    });

    const savedSale = await this.salesRepository.save(sale);

    const salesProductsData = createSaleDto.products.map((prod) =>
      this.salesProductsRepository.create({
        sale: savedSale,
        product: { id: Number(prod.id) },
        quantity: prod.quantity,
      })
    );

    await this.salesProductsRepository.save(salesProductsData);
    return this.findById(savedSale.order_id);
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
    const [sales, total] = await this.salesRepository.findAndCount({
      relations: ["client", "salesProducts", "salesProducts.product"],
      where: search
        ? [
          { client: { firstname: ILike(`%${search}%`) } },
          { client: { lastname: ILike(`%${search}%`) } },
        ]
        : {},
      take: limit,
      skip: (page - 1) * limit,
    });

    const results = sales.map((sale) => ({
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
      products: sale.salesProducts.map((sp) => ({
        id: sp.product.id,
        product_name: sp.product.product_name,
        price: sp.product.price,
        quantity: sp.quantity,
      })),
      total: sale.salesProducts
        .reduce(
          (sum, sp) => sum + Number(sp.product.price) * sp.quantity,
          0
        )
        .toFixed(2),
    }));

    return {
      count: total,
      results,
    };
  }

  async findById(id: string) {
    const sale = await this.salesRepository.findOne({
      where: { order_id: id },
      relations: ["client", "salesProducts", "salesProducts.product"],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return {
      ...sale,
      total: sale.salesProducts
        .reduce(
          (sum, sp) => sum + Number(sp.product.price) * sp.quantity,
          0
        )
        .toFixed(2),
    };
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.findById(id);

    if (updateSaleDto.payment_status) {
      sale.payment_status = updateSaleDto.payment_status;
    }
    if (updateSaleDto.delivery_status) {
      sale.delivery_status = updateSaleDto.delivery_status;
    }

    if (updateSaleDto.products) {
      await this.salesProductsRepository.delete({
        sale: { order_id: sale.order_id },
      });

      const newSalesProducts = updateSaleDto.products.map((prod) =>
        this.salesProductsRepository.create({
          sale,
          product: { id: Number(prod.id) },
          quantity: prod.quantity,
        })
      );
      await this.salesProductsRepository.save(newSalesProducts);
    }

    await this.salesRepository.save(sale);
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.salesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return { message: "Sale deleted successfully" };
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