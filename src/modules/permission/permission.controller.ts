import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create.permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(data: CreatePermissionDTO){
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
}
