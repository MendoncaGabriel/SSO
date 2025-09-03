import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { UpdatePermissionDTO } from './dto/update.permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)

  @Role('write:permission')
  @Post()
  async create(@Body() data: CreatePermissionDTO){
    return await this.permissionService.create(data);
  }
  
  @Role('read:permission')
  @Get(":id")
  async listByClient(@Param() {id}: {id: string}){
    return await this.permissionService.listByClientId(id);
  }
  
  @Role('delete:permission')
  @Delete(":id")
  async delete(@Param() {id}:{id: string}){
    return await this.permissionService.delete(id)
  }
  
  @Role('update:permission')
  @Patch(":id")
  async update(
    @Param() {id}:{id: string},
    @Body() data: UpdatePermissionDTO 
  ){
    return await this.permissionService.update(id, data);
  }
}
