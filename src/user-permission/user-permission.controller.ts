import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDTO } from './dto/create.user-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  
  @Role('write:user-permission')
  @Post()
  async create(@Body() data: CreateUserPermissionDTO){
    return await this.userPermissionService.create(data)
  }
  
  @Role('read:user-permission')
  @Get()
  async list(){
    return await this.userPermissionService.list();
  }
  
  
  @Role('read:user-permission')
  @Get("/user/:userId")
  async listByUserId(@Param() {userId}: {userId: string}){
    return await this.userPermissionService.listByUserId(userId)
  }
  
  @Role('delete:user-permission')
  @Delete("/user/:userId/permission/:permissionId")
  async delete(
    @Param() {userId, permissionId}: {userId: string, permissionId: string}
  ){
    return await this.userPermissionService.delete(userId, permissionId)
  }

}
