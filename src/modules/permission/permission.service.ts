import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { db } from 'src/lib/prisma';
import { UpdatePermissionDTO } from './dto/update.permission.dto';

@Injectable()
export class PermissionService {
  async create(data: CreatePermissionDTO){
    const permissionsAlreadyExists  = await this.listByClientId(data.clientId);
    const exists = permissionsAlreadyExists.permissions.some(
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
    const permission = await db.permission.findUnique({
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

    const relatedUserPermissions = await db.userPermission.count({
      where: { permissionId: id }
    });

    if (relatedUserPermissions > 0) {
      throw new ConflictException(
        "There are users related to this permission, remove them first before deleting this permission"
      );
    }


    const permission = await db.permission.delete({
      where: {
        id
      }
    })
    return { permission }
  }

  async update(id: string, data: UpdatePermissionDTO){
    const permissionExists = await db.permission.findUnique({
      where: {
        id
      }
    })

    const checkNameAndClientId = await db.permission.findFirst({
      where: {
        AND: {
          name: data.name,
          clientId: data.clientId
        }
      }
    })
    if(checkNameAndClientId){
      throw new ConflictException("Permission already exists")
    }

    if(!permissionExists){
      throw new NotFoundException("Permission not found")
    }

    const permission = await db.permission.update({
      where: {
        id
      },
      data: {
        ...(data.clientId ? {clientId: data.clientId} : {}),
        ...(data.name ? {name: data.name} : {})
      }
    })

    return { permission }
  }
}
