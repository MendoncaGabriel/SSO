import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { UpdatePermissionDTO } from './dto/update.permission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(
    private readonly db: PrismaService
  ){}

  async create(data: CreatePermissionDTO){
    const permissionsAlreadyExists  = await this.listByClientId(data.clientId);
    const exists = permissionsAlreadyExists.permissions.some(
      (e) => e.clientId === data.clientId && e.name === data.name,
    );
    if (exists) {
      throw new ConflictException('Permission already exists');
    }
    
    
    const permission = await this.db.permission.create({
      data
    })
    return { permission }
  }

  async listByClientId(clientId: string){
    const permissions = await this.db.permission.findMany({
      where: {
        clientId
      },
      include: {
        client: {
          select: {
            name: true
          }
        }
      }
    })
    return { permissions }
  }

  async getById(id: string){
    const permission = await this.db.permission.findUnique({
      where: {
        id
      }
    })
    if(!permission){
      throw new NotFoundException("Permission not found")
    }
    return { permission }
  }

  async delete(id: string) {
    const permission = await this.db.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException("Permission not found");
    }

    // Se Role → Permission for 1:1
    const relatedRoles = await this.db.role.count({
      where: {
        permission: {
          id
        }
      }
    });

    if (relatedRoles > 0) {
      throw new ConflictException(
        "There are roles related to this permission, delete the roles first before deleting this permission"
      );
    }

    const relatedUserPermissions = await this.db.userPermission.count({
      where: { permissionId: id }
    });

    if (relatedUserPermissions > 0) {
      throw new ConflictException(
        "There are users related to this permission, remove them first before deleting this permission"
      );
    }

    try {
      const deleted = await this.db.permission.delete({
        where: { id }
      });
      return { permission: deleted };
    } catch (error: any) {
      if (error.code === "P2003") {
        throw new ConflictException(
          "Permission cannot be deleted because it is still referenced"
        );
      }
      throw error;
    }
  }

  async update(id: string, data: UpdatePermissionDTO){
    const client = await this.db.client.findUnique({
      where: {
        id: data.clientId
      }
    })
    if(!client){
      throw new NotFoundException("Client not found")
    }

    const permissionExists = await this.db.permission.findUnique({
      where: {
        id
      }
    })
    if(!permissionExists){
      throw new NotFoundException("Permission not found")
    }

    const checkNameAndClientId = await this.db.permission.findFirst({
      where: {
        name: data.name,
        clientId: data.clientId
      }
    })
    if(checkNameAndClientId){
      throw new ConflictException("Permission already exists")
    }

    const permission = await this.db.permission.update({
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

  async getByUserIdAndClientId(userId: string, clientId: string){
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user){
      throw new NotFoundException("User not found")
    }

    const client = await this.db.client.findUnique({
      where: {
        id: clientId
      }
    })
    if(!client){
      throw new NotFoundException("client not found")
    }

    const permission = await this.db.userPermission.findFirst({
      where: {
        userId,
        permission: {
          clientId
        }
      }
    })
    if(!permission){
      throw new NotFoundException("permission not found")
    }
    return { permission }
  }
}
