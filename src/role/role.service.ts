import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly db: PrismaService 
  ){}

  async create(data: CreateRoleDTO) {
    const { roles } = await this.listByPermissionId(data.permissionId);

    const existingRules = roles.filter(e => {
      e.action === data.action &&
        e.permissionId === data.action &&
        e.resource === data.action
    })

    if (existingRules.length !== 0) {
      throw new ConflictException("This role already exists")
    }

    const role = await this.db.role.create({
      data
    })
    return { role }
  }

  async update(id: string, data: UpdateRoleDTO) {
    const role = await this.db.role.update({
      where: {
        id
      },
      data: {
        ...(data.action ? { action: data.action } : {}),
        ...(data.resource ? { resource: data.resource } : {}),
        ...(data.permissionId ? { permissionId: data.permissionId } : {})
      }
    })

    return { role }
  }

  async getById(id: string) {
    const role = await this.db.role.findUnique({
      where: { id }
    });

    return { role };
  }

  async delete(id: string) {
    const _role = await this.getById(id);
    if (!_role.role) {
      throw new NotFoundException("Role not found");
    }

    const role = await this.db.role.delete({
      where: { id }
    });

    return { role };
  }

  async listByPermissionId(permissionId: string) {
    const permission = await this.db.permission.findUnique({
      where: {
        id: permissionId
      }
    })
    if (!permission) {
      throw new NotFoundException("Permission not found")
    }
    const roles = await this.db.role.findMany({
      where: {
        permissionId
      }
    })


    return { roles }
  }
}
