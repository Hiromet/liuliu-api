import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query, Res,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Response } from 'express';


@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {
  }

  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  getAllSales(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.salesService.findAll({ search, page, limit });
  }

  @Get(':id')
  getSaleById(@Param('id') id: string) {
    return this.salesService.findById(id);
  }

  @Put(':id')
  updateSale(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  deleteSale(@Param('id') id: string) {
    return this.salesService.delete(id);
  }

  @Get(':id/pdf')
  async getSalePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.salesService.generatePdf(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Sale-${id}.pdf`,
      });
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      res.status(500).json({ message: 'Could not generate PDF', error: error.message });
    }
  }
}