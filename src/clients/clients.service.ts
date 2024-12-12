import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from './clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>,
  ) {}

  async findAll(
    pageNumber: number,
    pageSize: number,
    search?: string,
  ): Promise<{ count: number; results: Clients[] }> {
    const query = this.clientsRepository.createQueryBuilder('client');

    if (search) {
      query
        .where('client.firstname LIKE :search', { search: `%${search}%` })
        .orWhere('client.lastname LIKE :search', { search: `%${search}%` })
        .orWhere('client.district LIKE :search', { search: `%${search}%` })
        .orWhere('client.email LIKE :search', { search: `%${search}%` });
    }

    query
      .orderBy('client.id', 'ASC')
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    const [results, count] = await query.getManyAndCount();

    console.log('Count:', count);
    console.log('Results:', results);

    return { count, results };
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
