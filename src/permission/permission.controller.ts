import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create.permission.dto';
import { UpdatePermissionDTO } from './dto/update.permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() data: CreatePermissionDTO){
    return await this.permissionService.create(data);
  }

  @Get(":id")
  async listByClient(@Param() {id}: {id: string}){
    return await this.permissionService.listByClientId(id);
  }

  @Delete(":id")
  async delete(@Param() {id}:{id: string}){
    return await this.permissionService.delete(id)
  }
  
  @Patch(":id")
  async update(
    @Param() {id}:{id: string},
    @Body() data: UpdatePermissionDTO 
  ){
    return await this.permissionService.update(id, data);
  }
}
