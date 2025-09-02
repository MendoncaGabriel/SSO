import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  
  @Post()
  async create(@Body() data: CreateRoleDTO){
    return await this.roleService.create(data);
  }

  @Patch(":id")
  async update(
    @Param() {id}: {id: string}, 
    @Body() data: UpdateRoleDTO
  ){
    return await this.roleService.update(id, data)
  }

  @Delete(":id")
  async delete(@Param() {id}: {id: string}){
    return await this.roleService.delete(id)
  }

  @Get(":permissionId")
  async listByPermissionId(@Param() {permissionId}: {permissionId: string}){
    return await this.roleService.listByPermissionId(permissionId)
  }
}
