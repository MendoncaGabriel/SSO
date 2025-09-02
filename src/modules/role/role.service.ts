import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDTO } from './dto/create.role.dto';
import { db } from 'src/lib/prisma';
import { UpdateRoleDTO } from './dto/update.role.dto';

@Injectable()
export class RoleService {
  async create(data: CreateRoleDTO){
    const role = await db.role.create({
      data
    })
    return { role }
  }

  async update(id: string, data: UpdateRoleDTO){
    const role = await db.role.update({
      where : {
        id
      },
      data: {
        ...(data.action ? {action: data.action}  : {}),
        ...(data.resource ? {resource: data.resource}  : {}),
        ...(data.permissionId ? {permissionId: data.permissionId}  : {})
      }
    })

    return { role }
  }

  async getById(id: string) {
    const role = await db.role.findUnique({
      where: { id }
    });

    return { role };
  }

  async delete(id: string) {
    const _role = await this.getById(id);
    if (!_role.role) {
      throw new NotFoundException("Role not found");
    }

    const role = await db.role.delete({
      where: { id }
    });

    return { role };
}

  async listByPermissionId(permissionId: string){
    const permission = await db.permission.findUnique({
      where: {
        id: permissionId
      }
    })
    if(!permission){
      throw new NotFoundException("Permission not found")
    }
    const roles = await db.role.findMany({
      where: {
        permissionId
      }
    })
    if(!roles || roles.length === 0){
      throw new NotFoundException("Roles not found")
    }

    return { roles }
  }
}
