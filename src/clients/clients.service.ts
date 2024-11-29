import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Clients } from './clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>,
  ) {}

  findAll(search?: string): Promise<Clients[]> {
    const whereClause = search
      ? [
          { firstname: Like(`%${search}%`) },
          { lastname: Like(`%${search}%`) },
          { district: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : undefined;

    return this.clientsRepository.find({
      where: whereClause,
      order: { id: 'ASC' },
    });
  }

  findOne(id: number): Promise<Clients> {
    return this.clientsRepository.findOne({ where: { id } });
  }

  create(clientData: Partial<Clients>): Promise<Clients> {
    const newClient = this.clientsRepository.create(clientData);
    return this.clientsRepository.save(newClient);
  }

  async update(id: number, updateData: Partial<Clients>): Promise<Clients> {
    await this.clientsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}
