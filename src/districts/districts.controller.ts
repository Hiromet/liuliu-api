import { Controller, Get } from '@nestjs/common';

@Controller('districts')
export class DistrictsController {
  @Get()
  getDistricts(): { districts: { value: string; label: string }[] } {
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

    const formattedDistricts = DISTRICT_CHOICES.map((district) => ({
      value: district,
      label: district,
    }));

    return { districts: formattedDistricts };
  }
}
