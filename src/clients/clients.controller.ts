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
  findAll(@Query('search') search?: string): Promise<Clients[]> {
    return this.clientsService.findAll(search);
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

  @Get('districts')
  getDistricts(): string[] {
    return DISTRICT_CHOICES;
  }
}

const DISTRICT_CHOICES = [
  'Ancón',
  'Ate',
  'Barranco',
  'Breña',
  'Carabayllo',
  'Chaclacayo',
  'Chorrillos',
  'Cieneguilla',
  'Comas',
  'El Agustino',
  'Independencia',
  'Jesús María',
  'La Molina',
  'La Victoria',
  'Lince',
  'Los Olivos',
  'Lurigancho',
  'Lurín',
  'Magdalena del Mar',
  'Miraflores',
  'Pachacamac',
  'Pucusana',
  'Pueblo Libre',
  'Puente Piedra',
  'Punta Hermosa',
  'Punta Negra',
  'Rímac',
  'San Bartolo',
  'San Borja',
  'San Isidro',
  'San Juan de Lurigancho',
  'San Juan de Miraflores',
  'San Luis',
  'San Martín de Porres',
  'San Miguel',
  'Santa Anita',
  'Santa María del Mar',
  'Santa Rosa',
  'Santiago de Surco',
  'Surquillo',
  'Villa El Salvador',
  'Villa María del Triunfo',
  'Callao',
  'Bellavista',
  'Carmen de La Legua Reynoso',
  'La Perla',
  'La Punta',
  'Ventanilla',
  'Mi Perú',
];
