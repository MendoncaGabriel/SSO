import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDTO } from './dto/create.client';
import { db } from 'src/lib/prisma';
import { UpdateClientDTO } from './dto/update.client';

@Injectable()
export class ClientService {
  async create(data: CreateClientDTO) {
    const [clientName, clientUrl] = await Promise.all([
      db.client.findFirst({ where: { name: data.name } }),
      db.client.findFirst({ where: { url: data.url } }),
    ]);

    if (clientName) {
      throw new ConflictException("Customer with name already exists");
    }
    if (clientUrl) {
      throw new ConflictException("Client with URL already exists");
    }

    const client = await db.client.create({ data });
    return { client };
  }

  async list() {
    const clients = await db.client.findMany();
    return { clients };
  }

  async findById(id: string) {
    const client = await db.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com id ${id} não encontrado`);
    }
    return { client };
  }

  async update(
    id: string, 
    { name, url }: UpdateClientDTO
  ) {
    try {
      const client = await db.client.update({
        where: { id },
        data: {
          ...(url ? { url } : {}),
          ...(name ? { name } : {}),
        },
      });
      return { client };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      }
      throw error;
    }
  }

  async delete(id: string) {
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
