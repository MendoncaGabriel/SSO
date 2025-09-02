import { Injectable } from '@nestjs/common';
import { CreateUserPermissionDTO } from './dto/create.user-permission.dto';
import { db } from 'src/lib/prisma';

@Injectable()
export class UserPermissionService {
  async create(data: CreateUserPermissionDTO){
    const userPermission = await db.userPermission.create({
      data
    })
    return { userPermission }
  }

  async listByUserId(userId: string){
    const userPermissions = await db.userPermission.findMany({
      where: {
        userId
      }
    })

    return { userPermissions }
  }

  async delete(userId: string, permissionId: string){
    const userPermission = await db.userPermission.delete({
      where: {
        userId_permissionId: {
          userId,
          permissionId

        }
      }
    })

    return { userPermission }
  }
}
