import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDTO } from './dto/create.client';
import { db } from 'src/lib/prisma';
import { UpdateClientDTO } from './dto/update.client';
import { FindClientByIdDTO } from './dto/findById.client';
import { DeleteClientByIdDTO } from './dto/deleteclient';

@Injectable()
export class ClientService {
  async create(data: CreateClientDTO) {
    const client = await db.client.create({ data });
    return { client };
  }

  async list() {
    const clients = await db.client.findMany();
    return { clients };
  }

  async findById({ id }: FindClientByIdDTO) {
    const client = await db.client.findUnique({ where: { id } });
    return { client };
  }

  async update({ id }: FindClientByIdDTO, { name, url }: UpdateClientDTO) {
    const client = await db.client.update({
      where: { id },
      data: {
        ...(url ? { url } : {}),
        ...(name ? { name } : {}),
      },
    });
    return { client };
  }

  async delete({ id }: DeleteClientByIdDTO) {
    try {
      const client = await db.client.delete({ where: { id } });
      return { client };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      }
      throw error; 
    }
  }

  async findByName(name: string) {
    const client = await db.client.findFirst({ where: { name } });
    return { client };
  }

  async findByUrl(url: string) {
    const client = await db.client.findFirst({ where: { url } });
    return { client };
  }
}
