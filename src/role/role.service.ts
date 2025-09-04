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
    const existingRole = await this.db.role.findFirst({
      where: {
        action: data.action,
        resource: data.resource,
        permissionId: data.permissionId
      }
    });

    if (existingRole) {
      throw new ConflictException("This role already exists");
    }

    const role = await this.db.role.create({
      data
    })
    return { role }
  }

  async update(id: string, data: UpdateRoleDTO) {
    const roleExists = await this.db.role.findUnique({
      where: { id },
    });

    if (!roleExists) {
      throw new NotFoundException("Role not found");
    }

    if (data.permissionId) {
      const permissionExists = await this.db.permission.findUnique({
        where: { id: data.permissionId },
      });

      if (!permissionExists) {
        throw new NotFoundException("Permission not found");
      }
    }

    const duplicateRole = await this.db.role.findFirst({
      where: {
        action: data.action,
        resource: data.resource,
        permissionId: data.permissionId,
        NOT: { id },
      },
    });

    if (duplicateRole) {
      throw new ConflictException(
        "A role with this action already exists for this resource for this permission"
      );
    }

    try {
      const role = await this.db.role.update({
        where: { id },
        data: {
          ...(data.action ? { action: data.action } : {}),
          ...(data.resource ? { resource: data.resource } : {}),
          ...(data.permissionId ? { permissionId: data.permissionId } : {}),
        },
      });

      return { role };
    } catch (error: any) {
      if (error.code === "P2003") {
        throw new ConflictException(
          "Invalid foreign key: the specified permission does not exist"
        );
      }
      throw error;
    }
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
