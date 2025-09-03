import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDTO } from './dto/create.user-permission.dto';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Post()
  async create(@Body() data: CreateUserPermissionDTO){
    return await this.userPermissionService.create(data)
  }

  @Get()
  async list(){
    return await this.userPermissionService.list();
  }

  @Get("/user/:userId")
  async listByUserId(@Param() {userId}: {userId: string}){
    return await this.userPermissionService.listByUserId(userId)
  }

  @Delete("/user/:userId/permission/:permissionId")
  async delete(
    @Param() {userId, permissionId}: {userId: string, permissionId: string}
  ){
    return await this.userPermissionService.delete(userId, permissionId)
  }

}
