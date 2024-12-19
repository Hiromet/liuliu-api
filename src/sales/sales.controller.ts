import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  getAllSales() {
    return this.salesService.findAll();
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
}
