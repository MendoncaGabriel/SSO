import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPermissionDTO } from './dto/create.user-permission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPermissionService {
  constructor(
    private readonly db: PrismaService
  ){}
  
  async create(data: CreateUserPermissionDTO){
    const user = await this.db.user.findUnique({
      where: {
        id: data.userId
      }
    })
    if(!user){
      throw new NotFoundException("User not found")
    }
    const permission = await this.db.permission.findUnique({
      where: {
        id: data.permissionId
      }
    })
    if(!permission){
      throw new NotFoundException("Permission not found")
    }
    
    const userPermissionAlreadExists = await this.db.userPermission.findMany({
      where: {
        userId: data.userId,
        permissionId: data.permissionId
      }
    })

    if(userPermissionAlreadExists.length !== 0){
      throw new ConflictException("There is already a user permission with this userId and this permissionId")
    }

    const userPermission = await this.db.userPermission.create({
      data
    })
    return { userPermission }
  }

  async list(){
    const userPermission = await this.db.userPermission.findMany();
    return { userPermission }
  }

  async listByUserId(userId: string){
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user){
      throw new NotFoundException("User not found")
    }
    const userPermissions = await this.db.userPermission.findMany({
      where: {
        userId
      }
    })
    if(!userPermissions || userPermissions.length === 0){
      throw new NotFoundException("User permission not found")
    }

    return { userPermissions }
  }

  async delete(userId: string, permissionId: string){
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user){
      throw new NotFoundException("User not found")
    }

    const permission = await this.db.permission.findUnique({
      where: {
        id: permissionId
      }
    })
    if(!permission){
      throw new NotFoundException("Permission not found")
    }

    const userPermission = await this.db.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId, permissionId
        }
      }
    })
    if(!userPermission){
      throw new NotFoundException("UserPermission not found")
    }

    await this.db.userPermission.delete({
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
