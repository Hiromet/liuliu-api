import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Clients } from './clients.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ count: number; results: Clients[] }> {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    console.log(
      `Fetching clients - Page: ${pageNumber}, Limit: ${pageSize}, Search: ${search}`,
    );

    const response = await this.clientsService.findAll(
      pageNumber,
      pageSize,
      search,
    );
    console.log('Response from service:', response);

    return response;
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Clients> {
    return this.clientsService.findOne(id);
  }

  @Post()
  create(@Body() clientData: Partial<Clients>): Promise<Clients> {
    return this.clientsService.create(clientData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<Clients>,
  ): Promise<Clients> {
    return this.clientsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.clientsService.remove(id);
  }
}
