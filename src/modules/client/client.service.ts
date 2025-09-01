import { Injectable } from '@nestjs/common';
import { CreateClientDTO } from './dto/create.client';
import { db } from 'src/lib/prisma';
import { UpdateClientDTO } from './dto/update.client';
import { FindClientByIdDTO } from './dto/findById.client';
import { DeleteClientByIdDTO } from './dto/deleteclient';

@Injectable()
export class ClientService {
  async create(data: CreateClientDTO){
    const client = await db.client.create({ data });
    return { client }
  }

  async list() {
    const clients = await db.client.findMany();
    return { clients }
  }

  async getById({id}: FindClientByIdDTO){
    const client = await db.client.findUnique({
      where: {
        id
      }
    })
    return { client }
  }

  async update({ id, name, url }: UpdateClientDTO){
    const client = await db.client.update({
      where: { id },
      data: {
        ...(url ? { url } : {}),
        ...(name ? { name } : {}),
      }
    })

    return { client }
  }

  async delete({id}: DeleteClientByIdDTO){
    const client = await db.client.delete({
      where: {id}
    })
    return { client }
  }
}
