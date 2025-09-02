import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { db } from 'src/lib/prisma';

@Injectable()
export class PermissionService {
  async create(data: CreatePermissionDTO){
    const { permissions } = await this.listByClientId(data.clientId);
    if(!permissions ||  permissions.length === 0){
      throw new NotFoundException("Permission not found")
    }
    const exists = permissions.some(
      (e) => e.clientId === data.clientId && e.name === data.name,
    );

    if (exists) {
      throw new ConflictException('Permission already exists');
    }

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

  async getById(id: string){
    const permission = await db.permission.findFirst({
      where: {
        id
      }
    })
    if(!permission){
      throw new NotFoundException("Permission not found")
    }
    return { permission }
  }

  async delete(id: string){
    const {permission : permissionExists} = await this.getById(id);
    if(!permissionExists){
      throw new NotFoundException("Permission not found")
    }
    const relatedRules = await db.role.count();
    if(relatedRules !== 0){
      throw new ConflictException("There are rules related to this permission, delete the roles first before deleting this permission")
    }
    const permission = await db.permission.delete({
      where: {
        id
      }
    })
    return { permission }
  }
}
