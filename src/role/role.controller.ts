import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)

  @Role('write:role')
  @Post()
  async create(@Body() data: CreateRoleDTO){
    return await this.roleService.create(data);
  }
  
  @Role('update:role')
  @Patch(":id")
  async update(
    @Param() {id}: {id: string}, 
    @Body() data: UpdateRoleDTO
  ){
    return await this.roleService.update(id, data)
  }
  
  @Role('delete:role')
  @Delete(":id")
  async delete(@Param() {id}: {id: string}){
    return await this.roleService.delete(id)
  }
  
  
  @Role('read:role')
  @Get(":permissionId")
  async listByPermissionId(@Param() {permissionId}: {permissionId: string}){
    return await this.roleService.listByPermissionId(permissionId)
  }
}
