import { Injectable } from '@nestjs/common';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { db } from 'src/lib/prisma';

@Injectable()
export class PermissionService {
  async create(data: CreatePermissionDTO){
    const permission = await db.permission.create({
      data
    })
    return { permission }
  }

  async listByClientId(clientId: string){
    const permissions = await db.permission.findMany({
      where: {
        clientId
      }
    })
    return { permissions }
  }

  async delete(id: string){
    const permission = await db.permission.delete({
      where: {
        id
      }
    })
    return { permission }
  }
}
